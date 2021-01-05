#ifndef AUTHMIDDLEWARE_H
#define AUTHMIDDLEWARE_H

#include "../database/database.hpp"
#include <string>
#include <vector>
#include <nlohmann/json.hpp>

class AuthMiddleware
{

public:
    AuthMiddleware(Database &db) : database(db) {}
    bool checkSignIn(nlohmann::json body);
    bool checkLngPackageBody(const nlohmann::json &body);
    bool checkCreateGroupBody(const nlohmann::json &body);
    bool checkGetGroupBody(const nlohmann::json &body);
    bool checkCreateDrawerBody(const nlohmann::json &body);

private:
    Database &database;
};

#endif // AUTHMIDDLEWARE_H