target_include_directories(vocascan-server PRIVATE .)
target_sources(vocascan-server 
PRIVATE 
    main.cpp
    database.hpp 
    database.cpp 
    requestManager.hpp
    requestManager.cpp
    registration.hpp
    registration.cpp
    encryption.hpp
    #languagePackageHandler.hpp
    #languagePackageHandler.cpp
    #newVocabHandler.hpp
    #newVocabHandler.cpp
)

add_subdirectory(boilerplate)



