#ifndef REGISTRATION_H
#define REGISTRATION_H

#include <iostream>
#include <string>
#include "../database/database.hpp"

class Registration
{
public:
    Registration(Database &db) : database(db) {}

    bool registerUser(const std::string &username, const std::string &email, const std::string &password, bool adminRights);

private:
    Database &database;
};

#endif