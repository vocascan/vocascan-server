#ifndef REQUESTMANAGER_H
#define REQUESTMANAGER_H
#include "database.hpp"
#include <restinio/all.hpp>
#include <string>
#include <nlohmann/json.hpp>
#include <fstream>
#include "registration.hpp"
#include "authMiddleware.hpp"

class RequestManager
{

public:
    RequestManager(Database &db) : database(db), registration(db), authMiddleware(db)
    {
    }

    void startServer(const std::string &ipAddress, int port, bool isDebug);
    auto create_request_handler();

private:
    Database &database;
    AuthMiddleware authMiddleware;
    Registration registration;
    bool isDebugMode;
    std::string ipAddress;
    int port;
};

#endif