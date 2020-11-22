#ifndef REGISTRATION_H
#define REGISTRATION_H

#include <cryptopp/sha.h>
#include <cryptopp/filters.h>
#include <cryptopp/hex.h>
#include <cryptopp/files.h>
#include <iostream>
#include <string>
#include <ctime>
#include <unistd.h>
#include "database.hpp"

class Registration {
    public:
    Registration(Database &db) : database(db) {}

    std::string genSalt(const int len);
    std::string hashPassword(std::string password, std::string salt);
    void registerUser(std::string username, std::string email, std::string password);

    private:
    Database &database;
};


#endif