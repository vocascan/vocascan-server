const { VocabularyCard, Translation } = require('../../database');
const { Drawer } = require('../../database');

// create language package
async function createVocabularyCard({ languagePackageId, groupId }, name, description, userId, activate, res) {
  // if activate = false store vocabulary card in drawer 0 directly

  // select drawer id depending on the activate state
  const drawer = await Drawer.findOne({
    attributes: ['id'],
    where: {
      stage: activate ? 1 : 0,
      languagePackageId,
      userId,
    },
  });

  if (!drawer) {
    res.status(400).end();
    return false;
  }
  // create date the day before yesterday so it will appear in the inbox for querying
  let date = new Date();
  const yesterday = date.setDate(date.getDate() - 1);

  const vocabularyCard = await VocabularyCard.create({
    userId,
    languagePackageId,
    groupId,
    drawerId: drawer.id,
    name,
    description,
    lastQuery: yesterday,
    active: true,
  });

  if (!vocabularyCard) {
    res.status(400).end();
    return false;
  }

  return vocabularyCard;
}

// create translations
async function createTranslations(translations, userId, languagePackageId, vocabularyCardId) {
  await Promise.all(
    translations.map(async (translation) => {
      await Translation.create({
        userId,
        vocabularyCardId,
        languagePackageId,
        name: translation.name,
      });
    })
  );
}

async function destroyVocabularyCard(userId, vocabularyCardId) {
  await VocabularyCard.destroy({
    where: {
      id: vocabularyCardId,
      userId,
    },
  });
}

async function getGroupVocabulary(userId, groupId) {
  const vocabulary = await VocabularyCard.findAll({
    include: [
      {
        model: Translation,
        attributes: ['name'],
      },
    ],
    attributes: ['id', 'name', 'description'],
    where: {
      userId,
      groupId,
    },
  });

  return vocabulary;
}

async function updateVocabulary({ translations, ...card }, userId, vocabularyCardId) {
  // delete all translations belonging to vocabulary card

  await Translation.destroy({
    where: {
      userId,
      vocabularyCardId,
    },
  });

  const vocabulary = await VocabularyCard.findOne({
    where: {
      id: vocabularyCardId,
      userId,
    },
  });

  // change values from foreign Word
  await VocabularyCard.update(card, {
    fields: ['name', 'active', 'description'],
    where: {
      id: vocabularyCardId,
      userId,
    },
  });

  // create new translations from request
  await createTranslations(translations, userId, vocabulary.languagePackageId, vocabularyCardId);

  // fetch vocabulary Card to return it to user
  const newVocabulary = await VocabularyCard.findOne({
    include: [
      {
        model: Translation,
        attributes: ['name'],
      },
    ],
    attributes: ['name', 'description'],
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
