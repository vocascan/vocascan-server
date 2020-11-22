#include "requestManager.hpp"
#include <nlohmann/json.hpp>
#include <chrono>
#include <restinio/all.hpp>

template < typename RESP >
RESP
init_resp( RESP resp )
{
	resp.append_header( restinio::http_field::server, "RESTinio sample server /v.0.2" );
	resp.append_header_date_field();

	return resp;
}


//######################################################################//
//                           Request Handler                            //
//######################################################################//


using router_t = restinio::router::express_router_t<>;

auto RequestManager::create_request_handler()
{
	auto router = std::make_unique< router_t >();

	router->http_get(
		"/",
		[]( auto req, auto params){
				init_resp( req->create_response() )
					.append_header( restinio::http_field::content_type, "text/plain; charset=utf-8" )
					.set_body( "Hello world!")
					.done();

				return restinio::request_accepted();
		} );

	router->http_post(
		"/api/register",
		[&]( auto req, auto params){
			const auto username = restinio::cast_to<std::string>( params[ "username" ] );
			const auto email = restinio::cast_to<std::string>( params[ "email" ] );
			const auto password = restinio::cast_to<std::string>( params[ "password" ] );

			registration.registerUser(username, email, password);

			init_resp( req->create_response() )
				.append_header( restinio::http_field::content_type, "text/json; charset=utf-8" )
				.set_body( R"-({"message" : "Hello world!"})-")
				.done();

			return restinio::request_accepted();
		} );

	router->http_get(
		"/api/admin",
		[]( auto req, auto params){
				init_resp( req->create_response() )
						.append_header( restinio::http_field::content_type, "text/html; charset=utf-8" )
						.set_body(
							restinio::sendfile( "../src/adminPanel/index.html" ))
						.done();

				return restinio::request_accepted();
		} );

	return router;
}


void RequestManager::startServer() {
    using namespace std::chrono;

	try
	{   
        if(isDebugMode) {
            using traits_t =
		    restinio::traits_t<
			    restinio::asio_timer_manager_t,
			    restinio::single_threaded_ostream_logger_t,
			    router_t >;

            restinio::run(
                restinio::on_thread_pool<traits_t>(16)
			        .port( 8080 )
			        .address( "localhost" )
			        .request_handler( create_request_handler() ) );
        }
        else {
            using traits_t =
		    restinio::traits_t<
			    restinio::asio_timer_manager_t,
			    restinio::null_logger_t,
			    router_t >;
                
            restinio::run(
                restinio::on_thread_pool<traits_t>(16)
			        .port( 8080 )
			        .address( "localhost" )
			        .request_handler( create_request_handler() ) );
        }
        

        
		
	}
	catch( const std::exception & ex )
	{
		std::cerr << "Error: " << ex.what() << std::endl;
	}
}






