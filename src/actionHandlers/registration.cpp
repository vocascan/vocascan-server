#include "registration.hpp"
#include "boilerplate/user.hpp"
#include "encryption.hpp"

bool Registration::registerUser(const std::string &username, const std::string &email, const std::string &password, bool adminRights)
{
    //generate salt
    std::string salt = Encryption::genSalt(30);
    //hash password
    std::string hash = Encryption::hashPassword(password, salt);

    database.registerUser(User(Encryption::genSalt(15), username, email, salt, hash, adminRights));
}