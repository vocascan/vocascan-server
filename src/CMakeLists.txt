target_include_directories(Vocascan-server PRIVATE .)
target_sources(Vocascan-server 
PRIVATE 
    main.cpp

    database.hpp 
    database.cpp 
    requestManager.hpp
    requestManager.cpp
    registration.hpp
    registration.cpp
    #languagePackageHandler.hpp
    #languagePackageHandler.cpp
    #newVocabHandler.hpp
    #newVocabHandler.cpp
)

add_subdirectory(boilerplate)



