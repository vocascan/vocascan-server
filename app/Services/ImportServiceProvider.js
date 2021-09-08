const { Group } = require('../../database');
const { ForeignKeyConstraintError } = require('sequelize');
const ApiError = require('../utils/ApiError.js');
const httpStatus = require('http-status');
const { createDrawers } = require('./DrawerServiceProvider.js');
const { createLanguagePackage } = require('./LanguagePackageServiceProvider.js');
const { drawers } = require('../utils/constants.js');
const { createVocabularyCard, createTranslations } = require('./VocabularyServiceProvider.js');

async function storeGroupVocabulary(
  { name, description, VocabularyCards },
  userId,
  languagePackageId,
  active,
  activate
) {
  try {
    const group = await Group.create({
      userId,
      languagePackageId,
      name,
      description,
      active,
    });

    await Promise.all(
      VocabularyCards.map(async (vocabularyCard) => {
        const createdCard = await createVocabularyCard({
          languagePackageId,
          groupId: group.id,
          name: vocabularyCard.name,
          description: vocabularyCard.description,
          userId,
          active,
          activate,
        });
        // parse vocabulary card id from response and create translations
        createTranslations(vocabularyCard.Translations, userId, languagePackageId, createdCard.id);
      })
    );
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Error importing vocabs');
    }

    throw error;
  }
}

async function storeLanguagePackageVocabulary(
  { name, foreignWordLanguage, translatedWordLanguage, vocabsPerDay, rightWords, Groups, Drawers },
  userId,
  active,
  activate,
  queryStatus
) {
  // ------------------------------------------//
  // TO DO: ADD THESE TWO FUNCTIONS TOGETHER
  // ------------------------------------------//

  try {
    if (!Drawers && queryStatus) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No exported drawers found');
    }
    // create language Package
    const createdLanguagePackage = await createLanguagePackage(
      { name, foreignWordLanguage, translatedWordLanguage, vocabsPerDay, rightWords },
      userId
    );

    let createdDrawers = [];

    if (queryStatus) {
      createdDrawers = await createDrawers(Drawers, createdLanguagePackage.id, userId);
    } else {
      createdDrawers = await createDrawers(drawers, createdLanguagePackage.id, userId);
    }
    // store drawers for language package in database

    await Promise.all(
      Groups.map(async (group, index) => {
        const createdGroup = await Group.create({
          userId,
          languagePackageId: createdLanguagePackage.id,
          name: group.name,
          description: group.description,
          active,
        });

        await Promise.all(
          Groups[index].VocabularyCards.map(async (vocabularyCard) => {
            const createdCard = await createVocabularyCard({
              languagePackageId: createdLanguagePackage.id,
              groupId: createdGroup.id,
              name: vocabularyCard.name,
              description: vocabularyCard.description,
              // when drawers are imported too, put new vocabs in imported stages

              drawerId: queryStatus
                ? createdDrawers.find(
                    (drawer) => drawer.stage === Drawers.find((element) => element.id === vocabularyCard.drawerId).stage
                  ).id
                : null,
              userId,
              active,
              activate,
            });
            // parse vocabulary card id from response and create translations
            createTranslations(vocabularyCard.Translations, userId, createdLanguagePackage.id, createdCard.id);
          })
        );
      })
    );
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Error importing vocabs');
    }

    throw error;
  }
}

module.exports = {
  storeGroupVocabulary,
  storeLanguagePackageVocabulary,
};
