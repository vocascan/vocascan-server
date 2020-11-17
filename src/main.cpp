#include <iostream>
#include <pqxx/pqxx>
#include "database.hpp"
#include <string>
#include <httplib.h>
#include <nlohmann/json.hpp>

// for convenience
using json = nlohmann::json;

int main()
{

    std::ifstream file("../serverSettings.json");
    json jsonObj = json::parse(file);

    std::cout << jsonObj;
    //specify settings for Postgres
    std::string dbName = "vocascan";
    std::string userName = "user";
    std::string password = "user";
    std::string db_hostAddress = "127.0.0.1";
    int db_port = 5432;

    //specify settings for Server
    const char *server_hostAddress = "192.168.178.99";
    int server_port = 9000;

    Database database(jsonObj["postgresDbName"], jsonObj["postgresUserName"], jsonObj["postgresPassword"], jsonObj["postgresIpAdress"], jsonObj["postgresPort"]);

    //Startup page vor server
    std::cout << "-------------------------------" << std::endl
              << "|          | IP-adress | Port |" << std::endl
              << "-------------------------------" << std::endl
              << "| Database | " << db_hostAddress << " | " << db_port << " |" << std::endl
              << "-------------------------------" << std::endl
              << "| Server   | " << server_hostAddress << " | " << server_port << " |" << std::endl
              << "-------------------------------" << std::endl;

    httplib::Server svr;

    svr.Get("/hi", [](const httplib::Request &, httplib::Response &res) {
        res.set_content("Hello World!", "text/plain");
    });

    //start server
    svr.listen(jsonObj["serverIpAdress"], jsonObj["serverPort"]);
}