#ifndef ENCRYPTION_H
#define ENCRYPTION_H

#include <ctime>
#include <cryptopp/sha.h>
#include <cryptopp/filters.h>
#include <cryptopp/hex.h>
#include <cryptopp/files.h>
#include <unistd.h>
#include <string>
#include <iostream>
#include <cstdint>
#include <argon2.h>

namespace Encryption
{

    //generate random salt of predefined letters and numbers
    inline std::string genSalt(const int len)
    {

        std::string tmp_s;
        static const char alphanum[] =
            "0123456789"
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            "abcdefghijklmnopqrstuvwxyz"
            "%&/()=?{[]}*+#";

        srand((unsigned)time(NULL) * getpid());

        for (int i = 0; i < len; ++i)
            tmp_s += alphanum[rand() % (sizeof(alphanum) - 1)];

        return tmp_s;
    }

    //hash password with random generated salt
    inline std::string hashPassword(std::string t_password, std::string t_salt)
    {
        int hashLength = 32;
        int saltLength = 16;
        
        //store outcoming hash in bytes
        uint8_t storeHash[hashLength];

        //conversions
        uint8_t *salt = (uint8_t *)strdup(t_salt.c_str()); 
        uint8_t *password = (uint8_t *)strdup(t_password.c_str());
        uint8_t passwordLength = strlen((char *)password);


        uint32_t t_cost = 2;  
        uint32_t m_cost = (1<<16); 
        uint32_t para = 1; 

        argon2i_hash_raw(t_cost, m_cost, para, password, passwordLength, salt, saltLength, storeHash, hashLength);

        std::string output;
        char buffer[3]; //stores hex value which is converted to string
        for(int i = 0; i < hashLength; ++i) 
        {
            //direct conversion leads to malfomed hash
            //every value in storeHash is formated to a hex value then to char and at the end to a string
            sprintf(buffer, "%02x", storeHash[i]);  
            std::string swap(buffer); //conversion from char to string 
            output += swap; //add the converted hex value to return value 
        }

        return output;
    }
} // namespace Encryption

#endif
