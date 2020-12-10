#include "requestManager.hpp"
#include <nlohmann/json.hpp>
#include <chrono>
#include <restinio/all.hpp>
#include <sstream>

template <typename RESP>
RESP init_resp(RESP resp)
{
	resp.append_header(restinio::http_field::server, "RESTinio sample server /v.0.2");
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

	router->http_post(
		"/api/register",
		[&](auto req, auto params) {
			std::string body = req->body();
			nlohmann::json jsonObj;
			try
			{
				jsonObj = json::parse(body);
			}
			catch (const std::exception &e)
			{
				auto error = e.what();
				std::cerr << e.what() << std::endl;
			}

			std::string username = jsonObj["username"];
			std::string email = jsonObj["email"];
			std::string password = jsonObj["password"];

			registration.registerUser(username, email, password, false);

			init_resp(req->create_response())
				.append_header(restinio::http_field::content_type, "text/json; charset=utf-8;")
				.set_body("Person Registered")
				.done();

			return restinio::request_accepted();
		});

	router->http_get(
		"/api/admin",
		[](auto req, auto params) {
			init_resp(req->create_response())
				.append_header(restinio::http_field::content_type, "text/html; charset=utf-8")
				.set_body(
					restinio::sendfile("../src/adminPanel/index.html"))
				.done();

			return restinio::request_accepted();
		});

	return router;
}

void RequestManager::startServer(const std::string &ipAddress, int port)
{
	using namespace std::chrono;

	try
	{
		if (isDebugMode)
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
