const { LanguagePackage, Group, VocabularyCard } = require('../../database');

async function getNumberOfLanguagePackages(userId) {
  try {
    const number = await LanguagePackage.count({
      where: {
        userId,
      },
    });
    return [null, number];
  } catch (err) {
    return [{ status: 400, error: err.message }];
  }
}

async function getNumberOfActiveGroups(userId) {
  try {
    const number = await Group.count({
      where: {
        userId,
        active: true,
      },
    });
    return [null, number];
  } catch (err) {
    return [{ status: 400, error: err.message }];
  }
}

async function getNumberOfInactiveGroups(userId) {
  try {
    const number = await Group.count({
      where: {
        userId,
        active: false,
      },
    });
    return [null, number];
  } catch (err) {
    return [{ status: 400, error: err.message }];
  }
}

async function getNumberOfActiveVocabulary(userId) {
  try {
    const number = await VocabularyCard.count({
      where: {
        userId,
        active: true,
      },
    });
    return [null, number];
  } catch (err) {
    return [{ status: 400, error: err.message }];
  }
}

async function getNumberOfInactiveVocabulary(userId) {
  try {
    const number = await VocabularyCard.count({
      where: {
        userId,
        active: false,
      },
    });
    return [null, number];
  } catch (err) {
    return [{ status: 400, error: err.message }];
  }
}

module.exports = {
  getNumberOfLanguagePackages,
  getNumberOfActiveGroups,
  getNumberOfInactiveGroups,
  getNumberOfActiveVocabulary,
  getNumberOfInactiveVocabulary,
};
