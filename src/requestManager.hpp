#ifndef REQUESTMANAGER_H
#define REQUESTMANAGER_H
#include "database.hpp"
#include <restinio/all.hpp>
#include <string>
#include <nlohmann/json.hpp>
#include <fstream>
#include "registration.hpp"

using json = nlohmann::json;

class RequestManager
{

public:
    RequestManager(Database &db) : database(db), registration(db)
    {
        std::ifstream file("/home/julian/Files/Programmieren/Vocascan/Vocascan-server/serverSettings.json" /*"../serverSettings.json"*/);
        json jsonObj = json::parse(file);
        isDebugMode = jsonObj["serverDebug"];
    }

    void startServer(const std::string &ipAddress, int port);
    auto create_request_handler();

private:
    Database &database;
    Registration registration;
    bool isDebugMode = false;
};

#endif