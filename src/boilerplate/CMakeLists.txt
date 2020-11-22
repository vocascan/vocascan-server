target_include_directories(Vocascan-server PRIVATE .)
target_sources(Vocascan-server 
PRIVATE 
    foreignWord.hpp
    languagePackage.hpp
    translatedWord.hpp
    user.hpp
)
