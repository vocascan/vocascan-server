target_include_directories(vocascan-server PRIVATE .)
target_sources(vocascan-server 
PRIVATE 
    authMiddleware.cpp
    authMiddleware.hpp
    encryption.hpp
    jwt.hpp
)


