cmake_minimum_required(VERSION 3.14)
cmake_policy(VERSION 3.13)
cmake_policy(SET CMP0076 NEW)

if (NOT DEFINED SERVER_VERSION)
  set(SERVER_VERSION "0.0.0")
endif()
project(vocascan-server VERSION ${SERVER_VERSION})

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set (CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${ADDITIONAL_CFLAGS} -g")
SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -pthread")

include(${CMAKE_BINARY_DIR}/conanbuildinfo.cmake)
 conan_basic_setup()

add_executable(vocascan-server)
set_property(TARGET vocascan-server
    PROPERTY CXX_STANDARD 17)

target_sources(vocascan-server 
PRIVATE 
    serverSettings.json
)
target_link_libraries(vocascan-server ${CONAN_LIBS})

#---------------------------TESTING------------------------------#
add_executable(vocascan-server-testing)
set_property(TARGET vocascan-server-testing
    PROPERTY CXX_STANDARD 17)

target_sources(vocascan-server-testing 
PRIVATE 
    ./tests/tests.cpp
    #./tests/database-test.cpp
)
target_link_libraries(vocascan-server-testing ${CONAN_LIBS})


add_subdirectory(src) 
