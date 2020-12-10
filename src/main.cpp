#include <iostream>
#include <pqxx/pqxx>
#include "database.hpp"
#include "requestManager.hpp"
#include "registration.hpp"
#include <string>
#include <fstream>
#include <nlohmann/json.hpp>
#include <iomanip>

// for convenience
using json = nlohmann::json;

int main()
{
    //open server settings and parse them to json object
    std::ifstream file("/home/julian/Files/Programmieren/Vocascan/Vocascan-server/serverSettings.json" /*"../serverSettings.json"*/);
    json jsonObj = json::parse(file);

    //create database object -> start postgres database server
    Database database(jsonObj["postgresDbName"], jsonObj["postgresUserName"], jsonObj["postgresPassword"], jsonObj["postgresIpAdress"], jsonObj["postgresPort"]);

    std::cout << R"(
 _    _  _____   ______           _     ______        ______  
| |  | |/ ___ \ / _____)  /\     | |   / _____)  /\  |  ___ \ 
| |  | | |   | | /       /  \     \ \ | /       /  \ | |   | |
 \ \/ /| |   | | |      / /\ \     \ \| |      / /\ \| |   | |
  \  / | |___| | \_____| |__| |_____) ) \_____| |__| | |   | |
   \/   \_____/ \______)______(______/ \______)______|_|   |_|
                                                                    
)";
    //check if table roles is empty, which should be empty on the first startup of the server

    std::string ipAddress = "";
    int port = 0;

    if (database.checkTableEmpty("roles"))
    {
        //create roles
        database.addRole("user", false);
        database.addRole("admin", true);
        //add user with admin rights
        std::string username = "";
        std::string password = "";
        std::string email = "";
        std::cout << "Welcome to your personal Vocascan server. First of all let's create an admin user which lets you change all kinds of settings" << std::endl;
        std::cout << "Username: ";
        std::cin >> username;
        std::cout << "Password: ";
        std::cin >> password;
        std::cout << "Email: ";
        std::cin >> email;
        Registration registration(database);
        registration.registerUser(username, email, password, true);
        //define server settings

        std::cout << "Now we come to setting up the server";
        std::cout << "Ip-adress: ";
        std::cin >> ipAddress;
        jsonObj["serverIpAdress"] = ipAddress;
        std::cout << "Port: ";
        std::cin >> port;
        jsonObj["serverPort"] = ipAddress;
        std::ofstream outputFile("serverSettings.json");
        outputFile << std::setw(4) << jsonObj << std::endl;
    }

    //Startup page vor server
    std::cout << "-------------------------------" << std::endl
              << "|          | IP-adress | Port |" << std::endl
              << "-------------------------------" << std::endl
              << "| Database | " << jsonObj["postgresIpAdress"] << " | " << jsonObj["postgresPort"] << " |" << std::endl
              << "-------------------------------" << std::endl
              << "| Server   | " << jsonObj["serverIpAdress"] << " | " << jsonObj["serverPort"] << " |" << std::endl
              << "-------------------------------" << std::endl;

    //create Server and start it
    RequestManager requestManager(database);
    requestManager.startServer(ipAddress, port);
}