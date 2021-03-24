const { VocabularyCard, Translation } = require('../../database');
const { Drawer } = require('../../database');

// create language package
async function createVocabularyCard({ languagePackageId, groupId, name }, userId, activate) {
  // if activate = false store vocabulary card in drawer 0 directly
  if (!activate) {
    const drawer = await Drawer.findOne({
      attributes: ['id', 'stage'],
      where: {
        stage: 0,
        languagePackageId,
        userId,
      },
    });

    const vocabularyCard = await VocabularyCard.create({
      userId: userId,
      languagePackageId: languagePackageId,
      groupId: groupId,
      drawerId: drawer.id,
      name: name,
      lastQuery: new Date(),
      active: true,
    });

    return vocabularyCard;
  }

  // if user directly activates card, store it in drawer 1
  const drawer = await Drawer.findOne({
    attributes: ['id', 'stage'],
    where: {
      stage: 1,
      languagePackageId: languagePackageId,
      userId: userId,
    },
  });

  // create date the day before yesterday so it will appear in the inbox for querying
  let date = new Date();
  const yesterday = date.setDate(date.getDate() - 1);

  const vocabularyCard = await VocabularyCard.create({
    userId: userId,
    languagePackageId: languagePackageId,
    groupId: groupId,
    drawerId: drawer.id,
    name: name,
    lastQuery: yesterday,
    active: true,
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
