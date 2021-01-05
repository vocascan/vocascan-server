#include "database.hpp"
#include <string>
#include <iostream>

Database::Database(std::string dbName, std::string userName, std::string password, std::string hostAddress, int port)
{
	conn = "dbname = " + dbName + " user = " + userName + " password=" + password + " host=" + hostAddress + " port=" + std::to_string(port);
	try
	{
		pqxx::connection connection(conn);
		if (connection.is_open())
		{
			createTables();
		}
		else
		{
			std::cout << "Can't open database" << std::endl;
		}
	}
	catch (const std::exception &e)
	{
		std::cerr << e.what() << std::endl;
	}
}

bool Database::checkDatabaseAvailable()
{
	try
	{
		pqxx::connection connection(conn);
		//check if connection is good
		if (connection.is_open())
		{
			return true;
		}
		else
		{
			std::cout << "Can't open database" << std::endl;
			return false;
		}
	}
	catch (const std::exception &e)
	{
		std::cerr << e.what() << std::endl;
		return false;
	}
}

//convert bool to string
std::string Database::boolToStr(bool boolean)
{
	if (boolean)
	{
		return "True";
	}
	else
	{
		return "False";
	}
}

//check if entity exists in table
bool Database::checkEntityExist(const std::string &name, const std::string &tableName, const std::string &columnName)
{
	try
	{
		pqxx::connection connection(conn);
		pqxx::work worker(connection);
		std::string sql = "SELECT " + columnName + " from " + tableName + " WHERE " + columnName + "='" + name + "';";

		pqxx::result result{worker.exec(sql)};
		worker.commit();
		connection.close();
		int test = result.size();
		if (result.size() == 0)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	catch (const std::exception &e)
	{
		std::cerr << e.what() << std::endl;
		return 1;
	}
}

std::string Database::getEntity(std::string select, std::string tableName, std::string columnName, std::string entity)
{
	try
	{
		pqxx::connection connection(conn);
		pqxx::work worker(connection);
		std::string sql = "SELECT " + select + " from " + tableName + " WHERE " + columnName + "='" + entity + "';";

		pqxx::result result{worker.exec(sql)};
		worker.commit();
		int test = result.size();
		for (auto row : result)
		{
			return entity = row[select].c_str();
		}
	}
	catch (const std::exception &e)
	{
		std::cerr << e.what() << std::endl;
	}
}

// create all tables for database
bool Database::createTables()
{
	try
	{
		pqxx::connection connection(conn);
		pqxx::work worker(connection);
		std::string sql =

			"CREATE TABLE IF NOT EXISTS roles ("
			"id SERIAL PRIMARY KEY NOT NULL,"
			"name TEXT NOT NULL,"
			"admin_rights BOOL NOT NULL);"

			"CREATE TABLE IF NOT EXISTS users ("
			"id TEXT NOT NULL UNIQUE,"
			"name TEXT NOT NULL,"
			"email TEXT NOT NULL,"
			"salt TEXT NOT NULL,"
			"hash TEXT NOT NULL,"
			"role_id INTEGER NOT NULL,"
			"FOREIGN KEY(role_id) REFERENCES roles(id));"

			"CREATE TABLE IF NOT EXISTS language_package ("
			"id SERIAL PRIMARY KEY NOT NULL,"
			"user_id TEXT NOT NULL,"
			"name TEXT NOT NULL,"
			"foreign_word_language TEXT NOT NULL,"
			"translated_word_language TEXT NOT NULL,"
			"vocabs_per_day INTEGER NOT NULL,"
			"right_words INTEGER NOT NULL,"
			"FOREIGN KEY(user_id) REFERENCES users(id));"

			"CREATE TABLE IF NOT EXISTS drawer ("
			"id SERIAL PRIMARY KEY NOT NULL,"
			"user_id TEXT NOT NULL,"
			"language_package_id	INTEGER NOT NULL,"
			"name TEXT NOT NULL,"
			"query_interval	INTEGER NOT NULL,"
			"FOREIGN KEY(language_package_id) REFERENCES language_package(id),"
			"FOREIGN KEY(user_id) REFERENCES users(id));"

			"CREATE TABLE IF NOT EXISTS groups ("
			"id SERIAL PRIMARY KEY NOT NULL,"
			"user_id TEXT NOT NULL,"
			"language_package_id INTEGER NOT NULL,"
			"name	TEXT NOT NULL,"
			"active BOOL NOT NULL,"
			"FOREIGN KEY(language_package_id) REFERENCES language_package(id),"
			"FOREIGN KEY(user_id) REFERENCES users(id));"

			"CREATE TABLE IF NOT EXISTS foreign_word ("
			"id SERIAL PRIMARY KEY NOT NULL,"
			"user_id TEXT NOT NULL,"
			"name	TEXT NOT NULL,"
			"language_package_id	INTEGER NOT NULL,"
			"group_id	INTEGER NOT NULL,"
			"drawer_id	INTEGER NOT NULL,"
			"FOREIGN KEY(language_package_id) REFERENCES language_package(id),"
			"FOREIGN KEY(group_id) REFERENCES groups(id),"
			"FOREIGN KEY(drawer_id) REFERENCES drawer(id),"
			"FOREIGN KEY(user_id) REFERENCES users(id));"

			"CREATE TABLE IF NOT EXISTS translated_word ("
			"id SERIAL PRIMARY KEY NOT NULL,"
			"user_id TEXT NOT NULL,"
			"foreign_word_id	INTEGER NOT NULL,"
			"name	TEXT NOT NULL,"
			"language_package_id	INTEGER NOT NULL,"
			"FOREIGN KEY(foreign_word_id) REFERENCES foreign_word(id),"
			"FOREIGN KEY(user_id) REFERENCES users(id));";

		worker.exec(sql);
		worker.commit();
		std::cout << "created Tables" << std::endl;
	}
	catch (const std::exception &e)
	{
		std::cerr << e.what() << std::endl;
		return 1;
	}
	return 0;
}

bool Database::checkTableEmpty(const std::string &tableName)
{
	try
	{
		pqxx::connection connection(conn);
		pqxx::work worker(connection);
		//check if any entity is in the table
		std::string sql = "select count(*) from " + tableName + ";";

		pqxx::result result{worker.exec(sql)};
		worker.commit();
		//check if result is 0 -> nothing in the database
		for (auto row : result)
		{
			std::string count = row["count"].c_str();
			if (count == "0")
			{
				return true;
			}
			else
			{
				return false;
			}
		}
	}
	catch (const std::exception &e)
	{
		std::cerr << e.what() << std::endl;
		return 1;
	}
}

bool Database::registerUser(User user)
{
	try
	{
		std::string roleId = "";
		if (user.adminRights)
		{
			roleId = "admin";
		}
		else
		{
			roleId = "user";
		}
		pqxx::connection connection(conn);
		pqxx::work worker(connection);
		std::string sql = "INSERT INTO users (id, name, email, salt, hash, role_id) VALUES ('" + user.userId + "', '" + user.username + "', '" + user.email + "', '" + user.salt + "', '" + user.hash + "', (select id from roles where name = '" + roleId + "'));";

		worker.exec(sql);
		worker.commit();
	}
	catch (const std::exception &e)
	{
		std::cerr << e.what() << std::endl;
		return 1;
	}
}

std::string Database::getUserRole(const std::string &id)
{
	try
	{
		pqxx::connection connection(conn);
		pqxx::work worker(connection);
		std::string sql = "SELECT name from roles WHERE id=(SELECT role_id from users WHERE id='" + id + "');";

		pqxx::result result{worker.exec(sql)};
		worker.commit();
		for (auto row : result)
		{
			return row["name"].c_str();
		}
	}
	catch (const std::exception &e)
	{
		std::cerr << e.what() << std::endl;
	}
}

std::string Database::getHash(const std::string &email)
{
	try
	{
		pqxx::connection connection(conn);
		//get hash from users table with the given email
		pqxx::work worker(connection);
		std::string sql = "SELECT hash from users WHERE email='" + email + "';";

		pqxx::result result{worker.exec(sql)};
		worker.commit();
		//iterate through the result and get the key-value pair with the key 'hash'
		for (auto row : result)
		{
			std::string count = row["hash"].c_str();
			return count;
		}
	}
	catch (const std::exception &e)
	{
		std::cerr << e.what() << std::endl;
	}
}

std::string Database::getSalt(const std::string &email)
{
	try
	{
		pqxx::connection connection(conn);
		//get salt from users table with the given email
		pqxx::work worker(connection);
		std::string sql = "SELECT salt from users WHERE email='" + email + "';";

		pqxx::result result{worker.exec(sql)};
		worker.commit();
		//iterate through the result and get the key-value pair with the key 'salt'
		for (auto row : result)
		{

			return row["salt"].c_str();
		}
	}
	catch (const std::exception &e)
	{
		std::cerr << e.what() << std::endl;
	}
}

bool Database::addRole(const std::string &name, bool adminRights)
{
	try
	{
		pqxx::connection connection(conn);
		pqxx::work worker(connection);
		std::string sql = "INSERT INTO roles (name, admin_rights) VALUES ('" + name + "', '" + boolToStr(adminRights) + "');";

		worker.exec(sql);
		worker.commit();
	}
	catch (const std::exception &e)
	{
		std::cerr << e.what() << std::endl;
		return 1;
	}
	return 0;
}

bool Database::createLanguagePackage(LanguagePackage lngPackage)
{
	try
	{
		pqxx::connection connection(conn);
		pqxx::work worker(connection);
		std::string sql = "INSERT INTO language_package (user_id, name, foreign_word_language, translated_word_language, vocabs_per_day, right_words) VALUES ('" + lngPackage.userId + "', '" + lngPackage.name + "', '" + lngPackage.foreignWordLanguage + "', '" + lngPackage.translatedWordLanguage + "', " + std::to_string(lngPackage.vocabsPerDay) + ", " + std::to_string(lngPackage.rightWords) + ");";

		worker.exec(sql);
		worker.commit();
	}
	catch (const std::exception &e)
	{
		std::cerr << e.what() << std::endl;
		return 1;
	}
	return 0;
}

nlohmann::json Database::getLanguagePackages(const std::string &userId)
{
	try
	{
		pqxx::connection connection(conn);
		pqxx::work worker(connection);
		std::string sql = "SELECT name from language_package WHERE user_id='" + userId + "' ORDER BY name ASC;";

		pqxx::result result{worker.exec(sql)};
		worker.commit();

		nlohmann::json jsonResult;
		//number for id
		size_t index = 0;
		//put result in json object
		for (auto row : result)
		{
			jsonResult.push_back({{"id", index}, {"name", row["name"].c_str()}});
			++index;
		}
		return jsonResult;
	}
	catch (const std::exception &e)
	{
		std::cerr << e.what() << std::endl;
		return 1;
	}
	return 0;
}

bool Database::addGroup(const std::string &name, const std::string userId, const std::string lngPackage, bool active)
{
	try
	{
		pqxx::connection connection(conn);
		pqxx::work worker(connection);
		std::string sql = "INSERT INTO groups (user_id, language_package_id, name, active) VALUES ('" + userId + "', (select id from language_package where user_id='" + userId + "' and name='" + lngPackage + "'), '" + name + "', " + boolToStr(active) + ");";

		worker.exec(sql);
		worker.commit();
	}
	catch (const std::exception &e)
	{
		std::cerr << e.what() << std::endl;
		return 1;
	}
	return 0;
}

nlohmann::json Database::getGroups(const std::string &userId, const std::string &lngPackage)
{
	try
	{
		pqxx::connection connection(conn);
		pqxx::work worker(connection);
		std::string sql = "SELECT name from groups WHERE user_id='" + userId + "' and language_package_id=(SELECT id from language_package where name='" + lngPackage + "') ORDER BY name ASC;";

		pqxx::result result{worker.exec(sql)};
		worker.commit();

		nlohmann::json jsonResult;
		//number for id
		size_t index = 0;
		//put result in json object
		for (auto row : result)
		{
			jsonResult.push_back({{"id", index}, {"name", row["name"].c_str()}});
			++index;
		}
		return jsonResult;
	}
	catch (const std::exception &e)
	{
		std::cerr << e.what() << std::endl;
		return 1;
	}
	return 0;
}

bool Database::createDrawer(const std::string &userId, const std::string &lngePackage, const std::string &name, int interval)
{
	try
	{
		pqxx::connection connection(conn);
		pqxx::work worker(connection);
		std::string sql = "INSERT INTO drawer (user_id, language_package_id, name, query_interval) VALUES ('" + userId + "', (SELECT id from language_package where name='" + lngePackage + "'), '" + name + "', '" + std::to_string(interval) + "');";

		worker.exec(sql);
		worker.commit();
	}
	catch (const std::exception &e)
	{
		std::cerr << e.what() << std::endl;
		return 1;
	}
	return 0;
}