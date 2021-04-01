const { VocabularyCard, Translation } = require('../../database');
const { Drawer } = require('../../database');
const { deleteKeysFromObject } = require('../utils');

// create language package
async function createVocabularyCard({ languagePackageId, groupId }, name, userId, activate, res) {
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

    if (!drawer) {
      res.status(400).end();
      return false;
    }

    const vocabularyCard = await VocabularyCard.create({
      userId: userId,
      languagePackageId: languagePackageId,
      groupId: groupId,
      drawerId: drawer.id,
      name: name,
      lastQuery: new Date(),
      active: true,
    });

    if (!vocabularyCard) {
      res.status(400).end();
      return false;
    }

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

  if (!drawer) {
    res.status(400).end();
    return false;
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
    lastQuery: yesterday,
    active: true,
  });

  return vocabularyCard;
}

// create translations
async function createTranslations(translations, userId, languagePackageId, vocabularyId, res) {
  await Promise.all(
    translations.map(async (translation) => {
      const createdTranslation = await Translation.create({
        userId: userId,
        vocabularyCardId: vocabularyId,
        languagePackageId: languagePackageId,
        name: translation.name,
      });

      if (!createdTranslation) {
        res.status(400).end();
        return false;
      }
      return false;
    })
  );
}

async function destroyVocabularyCard(userId, vocabularyId, res) {
  const vocabulary = await VocabularyCard.findOne({
    where: {
      id: vocabularyId,
      userId,
    },
  });

  if (!vocabulary) {
    res.status(404).end();
    return false;
  }

  await vocabulary.destroy();
  return false;
}

async function getGroupVocabulary(userId, groupId, res) {
  const vocabulary = await VocabularyCard.findAll({
    include: [
      {
        model: Translation,
        attributes: ['name'],
      },
    ],
    attributes: ['id', 'name'],
    where: {
      userId,
      groupId,
    },
  });

  if (!vocabulary) {
    res.status(404).end();
    return false;
  }

  return vocabulary;
}

async function updateVocabulary({ name, translations, active }, userId, vocabularyCardId, res) {
  // delete all translations belonging to vocabulary card

  const oldTranslations = await Translation.findAll({
    where: {
      userId,
      vocabularyCardId,
    },
  });

  // if there are no translation we don't need to destroy something
  if (oldTranslations.length !== 0) {
    await Promise.all(
      oldTranslations.map(async (oldTranslation) => {
        await oldTranslation.destroy();
      })
    );
  }

  // change name from foreign Word
  const vocabulary = await VocabularyCard.findOne({
    where: {
      id: vocabularyCardId,
      userId,
    },
  });

  if (!vocabulary) {
    res.status(404).end();
    return false;
  }

  vocabulary.name = name;
  vocabulary.active = active;
  await vocabulary.save();

  // create new vocabulary cards from request
  await createTranslations(translations, userId, vocabulary.languagePackageId, vocabularyCardId, res);

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

  return deleteKeysFromObject(['userId', 'createdAt', 'updatedAt'], newVocabulary.toJSON());
}

module.exports = {
  createVocabularyCard,
  createTranslations,
  destroyVocabularyCard,
  getGroupVocabulary,
  updateVocabulary,
};
