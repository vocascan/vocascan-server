#ifndef REQUESTMANAGER_H
#define REQUESTMANAGER_H
#include "database/database.hpp"
#include <restinio/all.hpp>
#include <string>
#include <nlohmann/json.hpp>
#include <fstream>
#include "actionHandlers/registration.hpp"
#include "auth/authMiddleware.hpp"
#include <nlohmann/json.hpp>

class RequestManager
{

public:
    RequestManager(Database &db, std::string &t_secret_key) : secret_key(t_secret_key), database(db), registration(db), authMiddleware(db)
    {
    }

    void startServer(const std::string &ipAddress, int port, bool isDebug);
    auto create_request_handler();

private:
    std::string secret_key;
    Database &database;
    AuthMiddleware authMiddleware;
    Registration registration;
    bool isDebugMode;
    std::string ipAddress;
    int port;
};

#endif
