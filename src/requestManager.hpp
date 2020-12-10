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

    }

    void startServer(const std::string &ipAddress, int port, bool isDebug);
    auto create_request_handler();

private:
    Database &database;
    Registration registration;
    bool isDebugMode;
    std::string ipAddress;
    int port;
};

#endif