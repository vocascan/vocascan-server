#ifndef JWT_H
#define JWT_H
#include <string>
#include <jwt-cpp/jwt.h>
#include <stdlib.h>

namespace JWT
{
    inline std::string createJwt(const std::string &userId, const std::string &role)
    {
        auto token = jwt::create()
                         .set_issuer("vocascan")
                         .set_type("JWT")
                         .set_payload_claim("userId", jwt::claim(std::string(userId)))
                         .set_payload_claim("userRole", jwt::claim(std::string(role)))
                         .set_issued_at(std::chrono::system_clock::now())
                         .set_expires_at(std::chrono::system_clock::now() + std::chrono::hours{3600})
                         .sign(jwt::algorithm::hs256{getev("SECRET_KEY")});

        return token;
    }

    inline bool checkTokenExpired(std::string jwt)
    {
        try
        {
            auto decoded = jwt::decode(jwt);
            auto verifier = jwt::verify()
                                .allow_algorithm(jwt::algorithm::hs256{getenv("SECRET_KEY")})
                                .with_issuer("vocascan");
            verifier.verify(decoded);
        }
        catch (...)
        {
            return true;
        }
        return false;
    }

    inline bool checkIfAdmin(std::string jwt)
    {
        auto decoded = jwt::decode(jwt);
        for (auto &e : decoded.get_payload_claims())
            if (e.first == "userRole")
            {
                        }
    }

    inline std::string validateJwt(std::string jwt)
    {

        /*for (auto &e : decoded.get_payload_claims())
            std::cout << e.first << " = " << e.second << std::endl;*/
    }

} // namespace JWT

#endif
