const { ForeignKeyConstraintError } = require('sequelize');
const { LanguagePackage, Group, VocabularyCard, Drawer } = require('../../database');
const { deleteKeysFromObject } = require('../utils');
const ApiError = require('../utils/ApiError.js');
const httpStatus = require('http-status');

// create language package
async function createLanguagePackage(
  { name, foreignWordLanguage, translatedWordLanguage, vocabsPerDay, rightWords },
  userId,
  transaction
) {
  try {
    const languagePackage = await LanguagePackage.create(
      {
        userId,
        name,
        foreignWordLanguage,
        translatedWordLanguage,
        vocabsPerDay,
        rightWords,
      },
      { transaction }
    );

    return deleteKeysFromObject(['userId', 'createdAt', 'updatedAt'], languagePackage.toJSON());
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'foreign or translated language not found');
    }

    throw error;
  }
}

// get language package
async function getLanguagePackages(userId, groups, onlyActivated) {
  // Get user with email from database
  const languagePackages = await LanguagePackage.findAll({
    // if groups is true, return groups to every language package
    /* eslint-disable no-nested-ternary */
    include: groups
      ? [
          {
            model: Group,
            attributes: ['id', 'name', 'description', 'active'],
          },
        ]
      : onlyActivated
      ? [
          {
            model: Group,
            attributes: ['id', 'name', 'description', 'active'],
            include: [
              {
                model: VocabularyCard,
                attributes: ['id'],
                include: [
                  {
                    model: Drawer,
                    attributes: ['stage'],
                  },
                ],
              },
            ],
          },
        ]
      : [],
    /* eslint-enable no-nested-ternary */
    attributes: ['id', 'name', 'foreignWordLanguage', 'translatedWordLanguage', 'vocabsPerDay', 'rightWords'],
    where: {
      userId,
      ...(onlyActivated && { '$Groups.active$': true } ? { '$Groups.VocabularyCards.Drawer.stage$': !0 } : null),
    },
  });

  return languagePackages;
}

async function destroyLanguagePackage(userId, languagePackageId) {
  const counter = await LanguagePackage.destroy({
    where: {
      id: languagePackageId,
      userId,
    },
  });

  if (counter === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'language package not found');
  }
  return false;
}

async function updateLanguagePackage(package, userId, languagePackageId) {
  try {
    const counter = await LanguagePackage.update(package, {
      fields: ['name', 'foreignWordLanguage', 'translatedWordLanguage', 'vocabsPerDay', 'rightWords'],
      where: {
        id: languagePackageId,
        userId,
      },
    });

    if (counter[0] === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'language package not found');
    }

    return false;
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'foreign or translated language not found');
    }

    throw error;
  }
}

module.exports = {
  createLanguagePackage,
  getLanguagePackages,
  destroyLanguagePackage,
  updateLanguagePackage,
};
