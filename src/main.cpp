#include <iostream>
#include <pqxx/pqxx>
#include "database/database.hpp"
#include "requestManager.hpp"
#include "boilerplate/user.hpp"
#include "actionHandlers/registration.hpp"
#include "auth/encryption.hpp"
#include <string>
#include <fstream>
#include <nlohmann/json.hpp>
#include <iomanip>
#include "version/version.h"
#include <array>
#include <vector>

//check if every environment variable is available
bool checkEnvAvailable(std::array<const char *, 9> env_var)
{
    for (int i = 0; i < env_var.size(); ++i)
    {
        //check if environment variable exists
        if (getenv(env_var.at(i)) == NULL)
        {
            return false;
        }
    }

    return true;
}

//create json format for every environment varialbe
nlohmann::json setEnvVariable()
{
    nlohmann::json env;
    /* A list of possible environment variables*/
    std::array<const char *, 9> env_variable = {"POSTGRES_IP_ADDRESS", "POSTGRES_DB_NAME", "POSTGRES_USERNAME", "POSTGRES_PASSWORD", "POSTGRES_PORT", "SERVER_IP_ADDRESS", "SERVER_PORT", "SERVER_DEBUG", "SECRET_KEY"};
    std::vector<std::string> env_value;

    if (checkEnvAvailable(env_variable))
    {
        for (int i = 0; i < env_variable.size(); ++i)
        {
            if (env_variable.at(i) == "SERVER_DEBUG")
            {
                bool setDebug = getenv(env_variable.at(i));
                env[env_variable.at(i)] = setDebug;
            }
            else if (env_variable.at(i) == "POSTGRES_PORT" || env_variable.at(i) == "SERVER_PORT")
            {

                int setPort = std::stoi(getenv(env_variable.at(i)));
                env[env_variable.at(i)] = setPort;
            }
            else
            {
                env[env_variable.at(i)] = getenv(env_variable.at(i));
            }
        }
    }
    else
    {
        std::cout << "There are some env variables missing. Using serverSettings.json instead\n";
        std::ifstream file("../../serverSettings.json");
        env = nlohmann::json::parse(file);
    }

    return env;
}

int main(int argc, char **argv, char **envp)
{
    nlohmann::json env = setEnvVariable();
    //create database object -> start postgres database server
    Database database(env["POSTGRES_DB_NAME"], env["POSTGRES_USERNAME"], env["POSTGRES_PASSWORD"], env["POSTGRES_IP_ADDRESS"], env["POSTGRES_PORT"]);
    //check if database is available
    if (!database.checkDatabaseAvailable())
    {
        return 1;
    }

    //check if database is started for the first time
    if (database.checkTableEmpty("roles"))
    {
        //add standart roles
        database.addRole("user", false);
        database.addRole("admin", true);
        //add admin user:
        std::string password = Encryption::genSalt(10);
        Registration registration(database);
        registration.registerUser("Vocascan", "", password, true);

        std::cout << "---------------------------------------------" << std::endl
                  << "Created Admin user. Please remember username and password to log in to the admin pannel. Username and Password can be changed there." << std::endl
                  << "Username: Vocascan" << std::endl
                  << "Password: " << password << std::endl
                  << "---------------------------------------------" << std::endl;
    }

    std::cout << R"(
 _    _  _____   ______           _     ______        ______  
| |  | |/ ___ \ / _____)  /\     | |   / _____)  /\  |  ___ \ 
| |  | | |   | | /       /  \     \ \ | /       /  \ | |   | |
 \ \/ /| |   | | |      / /\ \     \ \| |      / /\ \| |   | |
  \  / | |___| | \_____| |__| |_____) ) \_____| |__| | |   | |
   \/   \_____/ \______)______(______/ \______)______|_|   |_|
                                                                    
)";

    //Startup page vor server
    std::cout << "-------------------------------" << std::endl
              << "|          | IP-adress | Port |" << std::endl
              << "-------------------------------" << std::endl
              << "| Database | " << env["POSTGRES_IP_ADDRESS"] << " | " << env["POSTGRES_PORT"] << std::endl
              << "-------------------------------" << std::endl
              << "| Server   | " << env["SERVER_IP_ADDRESS"] << " | " << env["SERVER_PORT"] << std::endl
              << "-------------------------------" << std::endl
              << "| Version  |  " << Version::getVersion() << std::endl
              << "-------------------------------" << std::endl;
    //create Server and start it
    RequestManager requestManager(database);
    requestManager.startServer(env["SERVER_IP_ADDRESS"], env["SERVER_PORT"], env["SERVER_DEBUG"]);
}
