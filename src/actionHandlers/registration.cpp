#include "registration.hpp"
#include "boilerplate/user.hpp"
#include "encryption.hpp"

void Registration::registerUser(std::string username, std::string email, std::string password, bool adminRights)
{
    //generate salt
    std::string salt = Encryption::genSalt(30);
    //hash password
    std::string hash = Encryption::hashPassword(password, salt);

    database.registerUser(User(username, email, salt, hash, adminRights));
}