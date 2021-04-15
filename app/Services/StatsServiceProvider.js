const { LanguagePackage, Group, VocabularyCard } = require('../../database');

async function getNumberOfLanguagePackages(userId) {
  const number = await LanguagePackage.count({
    where: {
      userId,
    },
  });
  return number;
}

async function getNumberOfGroups(userId, active) {
  const number = await Group.count({
    where: {
      userId,
      active: !!active,
    },
  });
  return number;
}

async function getNumberOfVocabulary(userId, active) {
  const number = await VocabularyCard.count({
    where: {
      userId,
      active: !!active,
    },
  });
  return number;
}

module.exports = {
  getNumberOfLanguagePackages,
  getNumberOfGroups,
  getNumberOfVocabulary,
};
