const { VocabularyCard, Translation } = require('../../database');
const { Drawer } = require('../../database');
const { deleteKeysFromObject } = require('../utils');

// create language package
async function createVocabularyCard({ languagePackageId, groupId }, name, description, userId, activate, res) {
  try {
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

    const formatted = deleteKeysFromObject(
      ['userId', 'lastQuery', 'updatedAt', 'createdAt', 'languagePackageId', 'groupId', 'drawerId'],
      vocabularyCard.toJSON()
    );
    return formatted;
  } catch {
    res.status(400).end();
    return false;
  }
}

// create translations
async function createTranslations(translations, userId, languagePackageId, vocabularyCardId, res) {
  try {
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
    return false;
  } catch {
    res.status(400).end();
    return false;
  }
}

async function destroyVocabularyCard(userId, vocabularyCardId, res) {
  await VocabularyCard.destroy({
    where: {
      id: vocabularyCardId,
      userId,
    },
  })
    .then((deletedVocabularyCard) => {
      if (deletedVocabularyCard) {
        return false;
      }
      res.status(404).end();
      return false;
    })
    .catch(() => {
      res.status(400).end();
      return false;
    });
}

async function getGroupVocabulary(userId, groupId, res) {
  try {
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
  } catch {
    res.status(400).end();
    return false;
  }
}

async function updateVocabulary({ translations, ...card }, userId, vocabularyCardId, res) {
  try {
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

    if (!vocabulary) {
      res.status(404).end();
    }

    // change values from foreign Word
    await vocabulary.update(card, {
      fields: ['name', 'active', 'description'],
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
  } catch {
    res.status(400).end();
    return false;
  }
}

module.exports = {
  createVocabularyCard,
  createTranslations,
  destroyVocabularyCard,
  getGroupVocabulary,
  updateVocabulary,
};
