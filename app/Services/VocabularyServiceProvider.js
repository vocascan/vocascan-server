const { VocabularyCard, Translation } = require('../../database');
const { Drawer } = require('../../database');
const { deleteKeysFromObject } = require('../utils');

// create language package
async function createVocabularyCard({ languagePackageId, groupId }, name, description, userId, activate) {
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
      return [{ status: 404, error: 'no drawer found due to wrong lanuage package id' }];
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
    return [null, formatted];
  } catch (err) {
    return [{ status: 400, error: err.message }];
  }
}

// create translations
async function createTranslations(translations, userId, languagePackageId, vocabularyCardId) {
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
    return [null];
  } catch (err) {
    return [{ status: 400, error: err.message }];
  }
}

async function getGroupVocabulary(userId, groupId) {
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

    return [null, vocabulary];
  } catch (err) {
    return [{ status: 400, error: err.message }];
  }
}

async function destroyVocabularyCard(userId, vocabularyCardId) {
  try {
    const counter = await VocabularyCard.destroy({
      where: {
        id: vocabularyCardId,
        userId,
      },
    });
    if (counter) {
      return [{ status: 404, error: 'vocabulary card not found' }];
    }
    return [null];
  } catch (err) {
    return [{ status: 400, error: err.message }];
  }
}

async function updateVocabulary({ translations, ...card }, userId, vocabularyCardId) {
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
      return [{ status: 404, error: 'vocabulary card not found' }];
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

    return [null, newVocabulary];
  } catch (err) {
    return [{ status: 400, error: err.message }];
  }
}

module.exports = {
  createVocabularyCard,
  createTranslations,
  destroyVocabularyCard,
  getGroupVocabulary,
  updateVocabulary,
};
