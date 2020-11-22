#include "registration.hpp"
#include "boilerplate/user.hpp"

//generate random salt of predefined letters and numbers
std::string Registration::genSalt(const int len) {
    
    std::string tmp_s;
    static const char alphanum[] =
        "0123456789"
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        "abcdefghijklmnopqrstuvwxyz"
        "%&/()=?{[]}*+#";
    
    srand( (unsigned) time(NULL) * getpid());
    
    for (int i = 0; i < len; ++i) 
        tmp_s += alphanum[rand() % (sizeof(alphanum) - 1)];
    
    
    return tmp_s;
    
}

using namespace CryptoPP;

//hash password with random generated salt
std::string Registration::hashPassword(std::string password, std::string salt) {

    const int MAX_PHRASE_LENGTH=250;
    std::string msg = password + std::string(salt);
    CryptoPP::SHA256 hash;
    byte digest[ CryptoPP::SHA256::DIGESTSIZE ];

    hash.CalculateDigest( digest, (const byte*)msg.c_str(), msg.length());

    CryptoPP::HexEncoder encoder;
    std::string output;
    encoder.Attach( new CryptoPP::StringSink( output ) );
    encoder.Put( digest, sizeof(digest) );
    encoder.MessageEnd();

    return output;  
}


void Registration::registerUser(std::string username, std::string email, std::string password) {
    //generate salt
    std::string salt = genSalt(30);
    //hash password
    std::string hash = hashPassword(password, salt);

    database.registerUser(User(username, email, salt, hash));

}