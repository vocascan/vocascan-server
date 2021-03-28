const { VocabularyCard, Translation } = require('../../database');
const { Drawer } = require('../../database');

// create language package
async function createVocabularyCard({ languagePackageId, groupId }, name, userId, activate) {
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
async function createTranslations(userId, languagePackageId, vocabularyId, name) {
  const translation = await Translation.create({
    userId: userId,
    vocabularyCardId: vocabularyId,
    languagePackageId: languagePackageId,
    name: name,
  });

  return translation;
}

async function destroyVocabularyCard(userId, vocabularyId) {
  const vocabulary = await VocabularyCard.findOne({
    where: {
      id: vocabularyId,
      userId,
    },
  });

  await vocabulary.destroy();
}

async function getGroupVocabulary(userId, groupId) {
  const vocabulary = await VocabularyCard.findAll({
    include: [
      {
        model: Translation,
        attributes: ['name'],
      },
    ],
    attributes: ['name'],
    where: {
      userId,
      groupId,
    },
  });

  return vocabulary;
}

async function updateVocabulary({ name, translations }, userId, vocabularyCardId) {
  // delete all translations belonging to vocabulary card

  const oldTranslations = await Translation.findAll({
    where: {
      userId,
      vocabularyCardId,
    },
  });

  await Promise.all(
    oldTranslations.map(async (oldTranslation) => {
      await oldTranslation.destroy();
    })
  );

  // change name from foreign Word
  const vocabulary = await VocabularyCard.findOne({
    where: {
      id: vocabularyCardId,
      userId,
    },
  });

  vocabulary.name = name;
  await vocabulary.save();

  // create new vocabulary cards from request
  await Promise.all(
    translations.map(async (translation) => {
      await createTranslations(userId, vocabulary.languagePackageId, vocabularyCardId, translation.name);
    })
  );

  // fetch vocabulary Card to return it to user
  const newVocabulary = await VocabularyCard.findOne({
    include: [
      {
        model: Translation,
        attributes: ['name'],
      },
    ],
    attributes: ['name'],
    where: {
      id: vocabularyCardId,
      userId,
    },
  });

  return newVocabulary;
}

module.exports = {
  createVocabularyCard,
  createTranslations,
  destroyVocabularyCard,
  getGroupVocabulary,
  updateVocabulary,
};
