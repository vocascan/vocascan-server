#ifndef USER_H
#define USER_H

#include <string>

// struct for creating a languagePackage object
struct User
{
    User(std::string username, std::string email, std::string salt, std::string hash)
        : username(username), email(email), salt(salt), hash(hash) {}
    std::string username; 
    std::string email; 
    std::string salt;
    std::string hash; 
    
};

#endif