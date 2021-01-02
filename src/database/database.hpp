#ifndef DATABASE_H
#define DATABASE_H
#include <iostream>
#include <string>
#include <vector>
#include <pqxx/pqxx>
#include <nlohmann/json.hpp>
#include "../boilerplate/languagePackage.hpp"
#include "../boilerplate/translatedWord.hpp"
#include "../boilerplate/foreignWord.hpp"
#include "../boilerplate/user.hpp"

class Database
{
public:
    Database(std::string dbName, std::string userName, std::string password, std::string hostAddress, int port);

    bool checkDatabaseAvailable();

    bool checkEntityExist(const std::string &name, const std::string &tableName, const std::string &columnName);
    std::string getEntity(std::string select, std::string tableName, std::string columnName, std::string entity);
    //user specific methods
    bool registerUser(User user);
    std::string getUserRole(const std::string &id);

    std::string getHash(const std::string &email);
    std::string getSalt(const std::string &email);

    bool addRole(const std::string &name, bool adminRights);
    bool checkTableEmpty(const std::string &tableName);

    bool createLanguagePackage(LanguagePackage lngPackage);
    nlohmann::json getLanguagePackages(const std::string &userId);
    bool addGroup(const std::string &name, const std::string userId, const std::string lngPackage, bool active);
    nlohmann::json getGroups(const std::string &userId, const std::string &lngPackage);

private:
    std::string conn;

    bool createTables();
    std::string boolToStr(bool boolean);
};

#endif