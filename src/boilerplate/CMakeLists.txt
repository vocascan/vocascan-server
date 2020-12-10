target_include_directories(vocascan-server PRIVATE .)
target_sources(vocascan-server 
PRIVATE 
    foreignWord.hpp
    languagePackage.hpp
    translatedWord.hpp
    user.hpp
)
