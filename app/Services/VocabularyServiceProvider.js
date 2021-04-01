const { VocabularyCard, Translation } = require('../../database');
const { Drawer } = require('../../database');

// create language package
async function createVocabularyCard({ languagePackageId, groupId }, name, description, userId, activate, res) {
  // if activate = false store vocabulary card in drawer 0 directly

  let drawer;

  if (!activate) {
    drawer = await Drawer.findOne({
      attributes: ['id'],
      where: {
        stage: 0,
        languagePackageId,
        userId,
      },
    });

    if (!drawer) {
      res.status(400).end();
      return false;
    }
  } else {
    // if user directly activates card, store it in drawer 1
    drawer = await Drawer.findOne({
      attributes: ['id'],
      where: {
        stage: 1,
        languagePackageId: languagePackageId,
        userId: userId,
      },
    });

    if (!drawer) {
      res.status(400).end();
      return false;
    }
  }
  // create date the day before yesterday so it will appear in the inbox for querying
  let date = new Date();
  const yesterday = date.setDate(date.getDate() - 1);

  const vocabularyCard = await VocabularyCard.create({
    userId: userId,
    languagePackageId: languagePackageId,
    groupId: groupId,
    drawerId: drawer.id,
    name: name,
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
async function createTranslations(translations, userId, languagePackageId, vocabularyId) {
  await Promise.all(
    translations.map(async (translation) => {
      await Translation.create({
        userId: userId,
        vocabularyCardId: vocabularyId,
        languagePackageId: languagePackageId,
        name: translation.name,
      });
    })
  );
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
        attributes: ['name', 'description'],
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

async function updateVocabulary({ name, description, translations, active }, userId, vocabularyCardId, res) {
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

  // change values from foreign Word
  const vocabulary = await VocabularyCard.findOne({
    where: {
      id: vocabularyCardId,
      userId,
    },
  });

  vocabulary.name = name;
  vocabulary.active = active;
  vocabulary.description = description;
  await vocabulary.save();

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
