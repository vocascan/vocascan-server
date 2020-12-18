target_include_directories(vocascan-server PRIVATE .)
target_sources(vocascan-server 
PRIVATE 
    main.cpp
    requestManager.hpp
    requestManager.cpp
)

add_subdirectory(boilerplate)
add_subdirectory(actionHandlers)
add_subdirectory(auth)
add_subdirectory(database)
add_subdirectory(adminPanel)


