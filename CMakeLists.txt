cmake_minimum_required(VERSION 3.14)
cmake_policy(VERSION 3.13)
cmake_policy(SET CMP0076 NEW)

project(vocascan-server)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_CXX_STANDARD_REQUIRED ON)


set (CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${ADDITIONAL_CFLAGS} -g")
SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -pthread")

add_executable(vocascan-server)
set_property(TARGET vocascan-server
    PROPERTY CXX_STANDARD 17)

target_sources(vocascan-server 
PRIVATE 
    serverSettings.json
)

set(JSON_BuildTests OFF CACHE INTERNAL "") 
include(FetchContent)

#Installing external libs

#json lib
FetchContent_Declare(json GIT_REPOSITORY https://github.com/nlohmann/json.git)
FetchContent_MakeAvailable(json)
TARGET_LINK_LIBRARIES( vocascan-server LINK_PUBLIC nlohmann_json::nlohmann_json)

#postgres 
FetchContent_Declare(libpqxx GIT_REPOSITORY https://github.com/jtv/libpqxx)
FetchContent_MakeAvailable(libpqxx)
target_link_libraries(vocascan-server LINK_PUBLIC pqxx)

#crypto lib for hashing
FetchContent_Declare(cryptopp GIT_REPOSITORY https://github.com/weidai11/cryptopp)
FetchContent_MakeAvailable(cryptopp)
target_link_libraries(vocascan-server LINK_PUBLIC cryptopp)

#jwt-cpp
FetchContent_Declare(jwtcpp GIT_REPOSITORY https://github.com/Thalhammer/jwt-cpp)
FetchContent_MakeAvailable(jwtcpp)
target_link_libraries(vocascan-server LINK_PUBLIC jwt-cpp)

#fmt
FetchContent_Declare(fmt GIT_REPOSITORY https://github.com/fmtlib/fmt)
FetchContent_MakeAvailable(fmt)
target_link_libraries(vocascan-server LINK_PUBLIC fmt)

#Restinio
find_package(restinio REQUIRED)
target_link_libraries(vocascan-server PRIVATE restinio::restinio)

add_subdirectory(src) 
