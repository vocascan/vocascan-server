const { VocabularyCard, Translation } = require('../../database');
const { Drawer } = require('../../database');

// create language package
async function createVocabularyCard({ languagePackageId, groupId, name }, userId) {
  const drawer = await Drawer.findOne({
    attributes: ['id', 'name'],
    where: {
      name: '1',
      languagePackageId: languagePackageId,
      userId: userId,
    },
  });

  const vocabularyCard = await VocabularyCard.create({
    userId: userId,
    languagePackageId: languagePackageId,
    groupId: groupId,
    drawerId: drawer.id,
    name: name,
  });

  return vocabularyCard;
}

// create language package
async function createTranslations(userId, languagePackageId, vocabularyCardId, name) {
  const translation = await Translation.create({
    userId: userId,
    vocabularyCardId: vocabularyCardId,
    languagePackageId: languagePackageId,
    name: name,
  });

  return translation;
}

module.exports = {
  createVocabularyCard,
  createTranslations,
};
