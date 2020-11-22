cmake_minimum_required(VERSION 3.14)
cmake_policy(VERSION 3.13)
cmake_policy(SET CMP0076 NEW)

project(Vocascan-server)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_CXX_STANDARD_REQUIRED ON)


set (CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${ADDITIONAL_CFLAGS} -g")
SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -pthread")

add_executable(Vocascan-server)
set_property(TARGET Vocascan-server
    PROPERTY CXX_STANDARD 17)

set(JSON_BuildTests OFF CACHE INTERNAL "") 
include(FetchContent)


FetchContent_Declare(json GIT_REPOSITORY https://github.com/nlohmann/json.git)
FetchContent_MakeAvailable(json)
TARGET_LINK_LIBRARIES( Vocascan-server LINK_PUBLIC nlohmann_json::nlohmann_json)

find_package(fmt REQUIRED)
# RESTinio itself
find_package(restinio REQUIRED)

# Make your project dependent on restinio, 
# and let cmake deal with all the headers paths and linked libs.
target_link_libraries(Vocascan-server PRIVATE restinio::restinio)
target_link_libraries(Vocascan-server LINK_PUBLIC pqxx)
target_link_libraries(Vocascan-server LINK_PUBLIC cryptopp)

add_subdirectory(src) 
