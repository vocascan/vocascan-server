const { Group, VocabularyCard, Translation, Drawer, sequelize } = require('../../database');
const { ForeignKeyConstraintError } = require('sequelize');
const ApiError = require('../utils/ApiError.js');
const httpStatus = require('http-status');
const { createDrawers } = require('./DrawerServiceProvider.js');
const { createLanguagePackage } = require('./LanguagePackageServiceProvider.js');
const { drawers } = require('../utils/constants.js');

async function storeGroupVocabulary(
  { name, description, VocabularyCards },
  userId,
  languagePackageId,
  active,
  activate
) {
  const transaction = await sequelize.transaction();

  try {
    const group = await Group.create(
      {
        userId,
        languagePackageId,
        name,
        description,
        active,
      },
      { transaction }
    );

    const drawer = await Drawer.findOne({
      where: {
        userId,
        languagePackageId,
        stage: activate ? 1 : 0,
      },
      transaction,
    });

    const yesterday = new Date().setDate(new Date().getDate() - 1);

    await Promise.all(
      VocabularyCards.map(async (vocabularyCard) => {
        await VocabularyCard.create(
          {
            userId,
            languagePackageId,
            groupId: group.id,
            drawerId: drawer.id,
            name: vocabularyCard.name,
            description: vocabularyCard.description,
            lastQuery: yesterday,
            lastQueryCorrect: yesterday,
            active,
            Translations: vocabularyCard.Translations.map((translation) => ({
              name: translation.name,
              userId,
              languagePackageId,
            })),
          },
          {
            transaction,
            include: [
              {
                model: Translation,
              },
            ],
          }
        );
      })
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

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
  if (!Drawers && queryStatus) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No exported drawers found');
  }

  const transaction = await sequelize.transaction();

  try {
    // create language Package
    const createdLanguagePackage = await createLanguagePackage(
      { name, foreignWordLanguage, translatedWordLanguage, vocabsPerDay, rightWords },
      userId,
      transaction
    );

    let getDrawer = () => null;
    const yesterday = new Date().setDate(new Date().getDate() - 1);

    // store drawers for language package in database
    if (queryStatus) {
      const createdDrawers = await createDrawers(Drawers, createdLanguagePackage.id, userId, transaction);
      const drawerMap = Drawers.reduce(
        (_drawerMap, oldDrawer, index) => ({
          ..._drawerMap,
          [oldDrawer.id]: createdDrawers[index],
        }),
        {}
      );

      getDrawer = (oldId) => drawerMap[oldId];
    } else {
      const createdDrawers = await createDrawers(drawers, createdLanguagePackage.id, userId, transaction);
      const drawer = createdDrawers.find((_drawer) => _drawer.stage === (activate ? '1' : '0'));

      getDrawer = () => drawer;
    }

    await Promise.all(
      Groups.map(async (group) => {
        await Group.create(
          {
            userId,
            languagePackageId: createdLanguagePackage.id,
            name: group.name,
            description: group.description,
            active,
            VocabularyCards: group.VocabularyCards.map((vocabularyCard) => ({
              userId,
              languagePackageId: createdLanguagePackage.id,
              drawerId: queryStatus ? getDrawer(vocabularyCard.drawerId).id : getDrawer().id,
              name: vocabularyCard.name,
              description: vocabularyCard.description,
              lastQuery: yesterday,
              lastQueryCorrect: yesterday,
              active,
              Translations: vocabularyCard.Translations.map((translation) => ({
                name: translation.name,
                userId,
                languagePackageId: createdLanguagePackage.id,
              })),
            })),
          },
          {
            transaction,
            include: [
              {
                model: VocabularyCard,
                include: [
                  {
                    model: Translation,
                  },
                ],
              },
            ],
          }
        );
      })
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

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
