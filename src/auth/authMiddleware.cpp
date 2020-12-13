#include "authMiddleware.hpp"
#include "encryption.hpp"

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
        std::string salt = database.getSalt(body["email"]);
        std::string hash = database.getHash(body["email"]);
        std::string tempHash = Encryption::hashPassword(body["password"], salt);
        //if password is right, temphash should be the same as hash from database
        if (tempHash == hash)
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