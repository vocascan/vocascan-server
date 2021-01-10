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
    uuids::uuid_name_generator gen(uuids::uuid::from_string("47183823-2574-4bfd-b411-99ed177d3e43"));
    uuids::uuid const id = gen(username + email);
    std::string UUID = uuids::to_string(id);
    return UUID;
}
