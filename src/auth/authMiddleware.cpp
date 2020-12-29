#include "authMiddleware.hpp"
#include "encryption.hpp"
#include <future>

bool AuthMiddleware::checkSignIn(nlohmann::json body)
{
    //check if body includes everything the sign in needs
    if (body.contains("email") && body.contains("password"))
    {
        //first check if email exists in Database
        if (database.checkEntityExist(body["email"], "users", "email") == false)
        {
            return false;
        }
        //check if password is compatible with email
        //get hash and salt from email
        auto salt = std::async(std::launch::async, &Database::getSalt, &database, body["email"]);
        auto hash = std::async(std::launch::async, &Database::getHash, &database, body["email"]);
        salt.wait();
        std::string tempHash = Encryption::hashPassword(body["password"], salt.get());
        hash.wait();
        //if password is right, temphash should be the same as hash from database
        if (tempHash == hash.get())
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    else
    {
        return false;
    }
}