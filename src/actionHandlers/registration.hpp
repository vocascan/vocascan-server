#ifndef REGISTRATION_H
#define REGISTRATION_H

#include <iostream>
#include <string>
#include "../database/database.hpp"

class Registration
{
public:
    Registration(Database &db) : database(db) {}

    void registerUser(std::string username, std::string email, std::string password, bool adminRights);

private:
    Database &database;
};

#endif