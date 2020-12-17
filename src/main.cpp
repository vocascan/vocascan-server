#include <iostream>
#include <pqxx/pqxx>
#include "database/database.hpp"
#include "requestManager.hpp"
#include "actionHandlers/registration.hpp"
#include <string>
#include <fstream>
#include <nlohmann/json.hpp>
#include <iomanip>

//check if every env variable is available
bool checkEnvAvailable(const char **env_var, char **env_val)
{
    for (int i = 0; i < 8; i++)
    {
        //check if
        env_val[i] = getenv(env_var[i]);
        if (env_val[i] == NULL)
        {
            return false;
        }
    }
    return true;
}

int main(int argc, char **argv, char **envp)
{
    nlohmann::json env;
    /* A list of possible environment variables*/
    const char *env_var[8] = {"POSTGRES_IP_ADDRESS", "POSTGRES_DB_NAME", "POSTGRES_USERNAME", "POSTGRES_PASSWORD", "POSTGRES_PORT", "SERVER_IP_ADDRESS", "SERVER_PORT", "SERVER_DEBUG"};
    char *env_val[8];

    if (checkEnvAvailable(env_var, env_val))
    {
        for (int i = 0; i < 8; ++i)
        {
            if (env_var[i] == "SERVER_DEBUG")
            {
                env_val[i] = getenv(env_var[i]);
                std::string var = env_var[i];
                bool val = env_val[i];
                env[var] = val;
            }
            else if (env_var[i] == "POSTGRES_PORT" || env_var[i] == "SERVER_PORT")
            {
                env_val[i] = getenv(env_var[i]);
                std::string var = env_var[i];
                std::string val = env_val[i];
                int valInt = std::stoi(val);
                env[var] = valInt;
            }
            else
            {
                env_val[i] = getenv(env_var[i]);
                std::string var = env_var[i];
                std::string val = env_val[i];
                env[var] = val;
            }
        }
    }
    else
    {
        std::cout << "There are some env variables missing. Using serverSettings.json instead" << std::endl;
        std::ifstream file("/home/julian/Files/Programmieren/Vocascan/vocascan-server/serverSettings.json");
        env = nlohmann::json::parse(file);
    }

    //create database object -> start postgres database server
    Database database(env["POSTGRES_DB_NAME"], env["POSTGRES_USERNAME"], env["POSTGRES_PASSWORD"], env["POSTGRES_IP_ADDRESS"], env["POSTGRES_PORT"]);

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
              << "| Database | " << env["POSTGRES_IP_ADDRESS"] << " | " << env["POSTGRES_PORT"] << " |" << std::endl
              << "-------------------------------" << std::endl
              << "| Server   | " << env["SERVER_IP_ADDRESS"] << " | " << env["SERVER_PORT"] << " |" << std::endl
              << "-------------------------------" << std::endl;

    //create Server and start it
    RequestManager requestManager(database);
    requestManager.startServer(env["SERVER_IP_ADDRESS"], env["SERVER_PORT"], env["SERVER_DEBUG"]);
}