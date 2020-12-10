#ifndef DATABASE_H
#define DATABASE_H
#include <iostream>
#include <string>
#include <vector>
#include <pqxx/pqxx>
#include "boilerplate/languagePackage.hpp"
#include "boilerplate/translatedWord.hpp"
#include "boilerplate/foreignWord.hpp"
#include "boilerplate/user.hpp"

class Database
{
public:
    Database(std::string dbName, std::string userName, std::string password, std::string hostAddress, int port);
    ~Database();

    //user specific methods
    bool registerUser(User user);

    bool addRole(const std::string &name, bool adminRights);
    bool checkTableEmpty(const std::string &tableName);
    //bool checkExistingEntity(const std::string &name, const std::string &tableName, const std::string &columnName);

    //void addLanguagePackage(const LanguagePackage &lngPckg);
    //std::vector<std::string> getLanguagePackages();

    //bool createDrawer(const std::string &name, int queryInterval, const std::string &lngPckgName);

    //void addGroup(const std::string &name, const std::string &lngPckName);
    //std::vector<std::string> getGroups(std::string packageName);

    //bool addForeignWord(const ForeignWord &foreignWord);
    //bool addTranslatedWord(const TranslatedWord &translatedWord);

private:
    pqxx::connection connection;

    bool createTables();
    std::string boolToStr(bool boolean);
};

#endif