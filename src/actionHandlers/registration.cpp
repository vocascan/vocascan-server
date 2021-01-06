#include "registration.hpp"
#include "boilerplate/user.hpp"
#include "encryption.hpp"
#include <uuid.h>
bool Registration::registerUser(const std::string &username, const std::string &email, const std::string &password, bool adminRights)
{
    //generate salt
    std::string salt = Encryption::genSalt(30);
    //hash password
    std::string hash = Encryption::hashPassword(password, salt);

    database.registerUser(User(createUUID(username, email), username, email, salt, hash, adminRights));
}

std::string Registration::createUUID(const std::string &username, const std::string &email)
{
    auto userId = uuids::uuid::from_string(username + email);
    std::string UUID = uuids::to_string(userId);
    return UUID;
}
