#ifndef LANGUAGEPACKAGE_H
#define LANGUAGEPACKAGE_H

#include <string>

// struct for creating a languagePackage object
struct LanguagePackage
{
    LanguagePackage(std::string userId, std::string name, std::string foreignWordLanguage, std::string translatedWordLanguage, int vocabsPerDay, int rightWords)
        : userId(userId), name(name), foreignWordLanguage(foreignWordLanguage), translatedWordLanguage(translatedWordLanguage), vocabsPerDay(vocabsPerDay), rightWords(rightWords) {}
    std::string userId;
    std::string name;
    std::string foreignWordLanguage;
    std::string translatedWordLanguage;
    int vocabsPerDay;
    int rightWords;
};

#endif