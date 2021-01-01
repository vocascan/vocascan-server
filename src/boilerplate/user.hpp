#ifndef USER_H
#define USER_H

#include <string>

// struct for creating a languagePackage object
struct User
{
    User(std::string userId, std::string username, std::string email, std::string salt, std::string hash, bool adminRights)
        : userId(userId), username(username), email(email), salt(salt), hash(hash), adminRights(adminRights) {}
    std::string userId;
    std::string username;
    std::string email;
    std::string salt;
    std::string hash;
    bool adminRights;
};

#endif