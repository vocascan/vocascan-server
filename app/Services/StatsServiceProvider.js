const { LanguagePackage, Group, VocabularyCard } = require('../../database');

async function getNumberOfLanguagePackages(userId) {
  const number = await LanguagePackage.count({
    where: {
      userId,
    },
  });
  return number;
}

async function getNumberOfActiveGroups(userId) {
  const number = await Group.count({
    where: {
      userId,
      active: true,
    },
  });
  return number;
}

async function getNumberOfInactiveGroups(userId) {
  const number = await Group.count({
    where: {
      userId,
      active: false,
    },
  });
  return number;
}

async function getNumberOfActiveVocabulary(userId) {
  const number = await VocabularyCard.count({
    where: {
      userId,
      active: true,
    },
  });
  return number;
}

async function getNumberOfInactiveVocabulary(userId) {
  const number = await VocabularyCard.count({
    where: {
      userId,
      active: false,
    },
  });
  return number;
}

module.exports = {
  getNumberOfLanguagePackages,
  getNumberOfActiveGroups,
  getNumberOfInactiveGroups,
  getNumberOfActiveVocabulary,
  getNumberOfInactiveVocabulary,
};
