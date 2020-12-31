#include "requestManager.hpp"
#include <nlohmann/json.hpp>
#include <chrono>
#include <restinio/all.hpp>
#include <sstream>
#include <iostream>
#include "auth/jwt.hpp"
#include <future>
#define STRINGIFY(x) #x

template <typename RESP>
RESP init_resp(RESP resp)
{
	resp.append_header(restinio::http_field::server, "Vocascan");
	resp.append_header_date_field();
	resp.append_header(restinio::http_field::access_control_allow_origin, "*");

	return resp;
}

//######################################################################//
//                           Request Handler                            //
//######################################################################//

using router_t = restinio::router::express_router_t<>;

auto RequestManager::create_request_handler()
{
	auto router = std::make_unique<router_t>();

	router->http_get(
		"/",
		[](auto req, auto params) {
			init_resp(req->create_response())
				.append_header(restinio::http_field::content_type, "text/plain; charset=utf-8")
				.set_body("Hello world!")
				.done();

			return restinio::request_accepted();
		});

	//--------------------------------------------------------------------------------------//
	//                                       REGISTER                                       //
	//--------------------------------------------------------------------------------------//
	router->http_post(
		"/api/register",
		[&](auto req, auto params) {
			std::string body = req->body();
			nlohmann::json jsonBody;
			try
			{
				jsonBody = nlohmann::json::parse(body);
			}
			catch (const std::exception &e)
			{
				auto error = e.what();
				std::cerr << e.what() << std::endl;
			}

			//check if email already exists
			if (database.checkEntityExist(jsonBody["email"], "users", "email"))
			{
				init_resp(req->create_response(restinio::status_conflict()))
					.append_header(restinio::http_field::content_type, "text/json; charset=utf-8;")
					.set_body("email already exists")
					.done();

				return restinio::request_accepted();
			}
			else
			{
				//if not already exists store username, email and password(needs to be hashed first) in database
				auto result = std::async(std::launch::async, &Registration::registerUser, &registration, jsonBody["username"], jsonBody["email"], jsonBody["password"], false);

				//get user id to create the jwt token
				std::string userId = database.getEntity("id", "users", "email", jsonBody["email"]);
				std::string role = database.getUserRole(userId);
				std::string jwt = JWT::createJwt(userId, role);
				//create response body
				nlohmann::json body = {
					{"jwt", jwt}};

				init_resp(req->create_response())
					.append_header(restinio::http_field::content_type, "application/json")
					.set_body(body.dump())
					.done();
				return restinio::request_accepted();
			}
		});

	//--------------------------------------------------------------------------------------//
	//                                       SIGN IN                                        //
	//--------------------------------------------------------------------------------------//

	router->http_post(
		"/api/signIn",
		[&](auto req, auto params) {
			std::string body = req->body();
			//parse body to jsonObj
			nlohmann::json jsonBody;
			try
			{
				jsonBody = nlohmann::json::parse(body);
			}
			catch (const std::exception &e)
			{
				auto error = e.what();
				std::cerr << e.what() << std::endl;
			}
			//check if request body and password is valid
			if (authMiddleware.checkSignIn(jsonBody) == false)
			{
				//Not valid
				init_resp(req->create_response(restinio::status_forbidden()))
					.append_header(restinio::http_field::content_type, "text/json; charset=utf-8;")
					.set_body("Email or password wrong")
					.done();
				return restinio::request_accepted();
			}
			else
			{
				//get user id to create the jwt token
				std::string userId = database.getEntity("id", "users", "email", jsonBody["email"]);
				std::string role = database.getUserRole(userId);
				std::string jwt = JWT::createJwt(userId, role);
				std::string username = database.getEntity("name", "users", "email", jsonBody["email"]);
				//create response body
				nlohmann::json body = {
					{"username", username},
					{"jwt", jwt}};

				init_resp(req->create_response())
					.append_header(restinio::http_field::content_type, "application/json")
					.set_body(body.dump())
					.done();
				return restinio::request_accepted();
			}
		});

	//--------------------------------------------------------------------------------------//
	//                                     CREATE PACKAGE                                   //
	//--------------------------------------------------------------------------------------//

	router->http_post(
		"/api/createPackage",
		[&](auto req, auto params) {
			//get JWT token from request header
			std::string jwtToken = std::string(req->header().value_of("Jwt"));

			//check if token is expired
			if (JWT::checkTokenExpired(std::string(jwtToken)))
			{
				//if expired return error message to client
				init_resp(req->create_response(restinio::status_unauthorized()))
					.append_header(restinio::http_field::content_type, "application/json")
					.set_body("JWT token expired")
					.done();
				return restinio::request_accepted();
			}
			//parse body from request
			std::string body = req->body();
			nlohmann::json jsonBody;
			try
			{
				jsonBody = nlohmann::json::parse(body);
			}
			catch (const std::exception &e)
			{
				auto error = e.what();
				std::cerr << e.what() << std::endl;
			}
			//check if body includes every parameter
			if (!authMiddleware.checkLngPackageBody(jsonBody))
			{
				init_resp(req->create_response(restinio::status_bad_request()))
					.append_header(restinio::http_field::content_type, "application/json")
					.set_body("Parameters in Body missing")
					.done();
				return restinio::request_accepted();
			}

			//check if package is already added
			bool isExisting = database.checkEntityExist(jsonBody["name"], "language_package", "name");
			//if duplicate return error code
			if (isExisting)
			{
				init_resp(req->create_response(restinio::status_conflict()))
					.append_header(restinio::http_field::content_type, "application/json")
					.set_body("Duplicate")
					.done();
				return restinio::request_accepted();
			}
			//create language package
			bool result = database.createLanguagePackage(LanguagePackage(JWT::getUserId(jwtToken), jsonBody["name"], jsonBody["foreignLanguage"], jsonBody["translatedLanguage"], jsonBody["vocabsPerDay"], jsonBody["rightTranslations"]));

			init_resp(req->create_response())
				.append_header(restinio::http_field::content_type, "application/json")
				.set_body("Created")
				.done();
			return restinio::request_accepted();
		});

	router->http_post(
		"/api/createGroup",
		[&](auto req, auto params) {
			//get JWT token from request header
			std::string jwtToken = std::string(req->header().value_of("Jwt"));

			//check if token is expired
			if (JWT::checkTokenExpired(std::string(jwtToken)))
			{
				//if expired return error message to client
				init_resp(req->create_response(restinio::status_unauthorized()))
					.append_header(restinio::http_field::content_type, "application/json")
					.set_body("JWT token expired")
					.done();
				return restinio::request_accepted();
			}
			//parse body from request
			std::string body = req->body();
			nlohmann::json jsonBody;
			try
			{
				jsonBody = nlohmann::json::parse(body);
			}
			catch (const std::exception &e)
			{
				auto error = e.what();
				std::cerr << e.what() << std::endl;
			}
			//check if body includes every parameter
			if (!authMiddleware.checkGroupBody(jsonBody))
			{
				init_resp(req->create_response(restinio::status_bad_request()))
					.append_header(restinio::http_field::content_type, "application/json")
					.set_body("Parameters in Body missing")
					.done();
				return restinio::request_accepted();
			}

			//check if package is already added
			bool isExisting = database.checkEntityExist(jsonBody["name"], "groups", "name");
			//if duplicate return error code
			if (isExisting)
			{
				init_resp(req->create_response(restinio::status_conflict()))
					.append_header(restinio::http_field::content_type, "application/json")
					.set_body("Duplicate")
					.done();
				return restinio::request_accepted();
			}
			//create language package
			bool error = database.addGroup(jsonBody["name"], JWT::getUserId(jwtToken), jsonBody["languagePackage"], jsonBody["active"]);

			if (!error)
			{
				init_resp(req->create_response())
					.append_header(restinio::http_field::content_type, "application/json")
					.set_body("Created")
					.done();
				return restinio::request_accepted();
			}
			else
			{
				init_resp(req->create_response(restinio::status_internal_server_error()))
					.append_header(restinio::http_field::content_type, "application/json")
					.set_body("Error occured")
					.done();
				return restinio::request_accepted();
			}
		});

	router->http_get(
		"/api/admin",
		[&](auto req, auto params) {
			//import html file in variable in order to make it available in the preprocessor
			const char *html =
#include "./adminPanel/index.html"
				;
			init_resp(req->create_response())
				.append_header(restinio::http_field::content_type, "text/html; charset=utf-8")
				.set_body(html)
				.done();

			return restinio::request_accepted();
		});

	return router;
}

void RequestManager::startServer(const std::string &ipAddress, int port, bool isDebug)
{
	using namespace std::chrono;

	try
	{
		if (isDebug)
		{
			using traits_t =
				restinio::traits_t<
					restinio::asio_timer_manager_t,
					restinio::single_threaded_ostream_logger_t,
					router_t>;

			restinio::run(
				restinio::on_thread_pool<traits_t>(16)
					.port(port)
					.address(ipAddress)
					.request_handler(create_request_handler()));
		}
		else
		{
			using traits_t =
				restinio::traits_t<
					restinio::asio_timer_manager_t,
					restinio::null_logger_t,
					router_t>;

			restinio::run(
				restinio::on_thread_pool<traits_t>(16)
					.port(port)
					.address(ipAddress)
					.request_handler(create_request_handler()));
		}
	}
	catch (const std::exception &ex)
	{
		std::cerr << "Error: " << ex.what() << std::endl;
	}
}
