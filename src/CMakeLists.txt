target_include_directories(Vocascan-server PRIVATE .)
target_sources(Vocascan-server 
PRIVATE 
    main.cpp
    requestManager.hpp 
    requestManager.cpp 
    database.hpp 
    database.cpp 
    languagePackageHandler.hpp
    languagePackageHandler.cpp
    newVocabHandler.hpp
    newVocabHandler.cpp
)

add_subdirectory(boilerplate)



