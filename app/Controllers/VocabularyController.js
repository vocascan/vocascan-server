const {
  createVocabularyCard,
  createTranslations,
  destroyVocabularyCard,
  getGroupVocabulary,
  updateVocabulary,
} = require('../Services/VocabularyServiceProvider.js');

async function addVocabularyCard(req, res) {
  try {
    // get userId from request
    const userId = req.user.id;
    const { name, description, translations } = req.body;
    const { languagePackageId } = req.params;

    // check if user wants to train vocabulary card directly
    const activate = req.query.activate === 'true';

    // create vocabulary card
    const [error, vocabularyCard] = await createVocabularyCard(req.params, name, description, userId, activate);
    if (error) {
      res.status(error.status).send({ error: error.error });
    }

    // parse vocabulary card id from response and create translations
    const [translationError] = await createTranslations(translations, userId, languagePackageId, vocabularyCard.id);
    if (translationError) {
      res.status(translationError.status).send({ error: translationError.error });
    }

    vocabularyCard.translations = translations;

    res.send(vocabularyCard);
  } catch (e) {
    console.log(e.message);
    res.status(500).end();
  }
}

async function deleteVocabularyCard(req, res) {
  try {
    // get userId from request
    const userId = req.user.id;
    const { vocabularyId } = req.params;

    const [error] = await destroyVocabularyCard(userId, vocabularyId);
    if (error) {
      res.status(error.status).send({ error: error.error });
    }

    res.status(204).end();
  } catch (e) {
    console.log(e.message);
    res.status(500).end();
  }
}

async function sendGroupVocabulary(req, res) {
  try {
    // get userId from request
    const userId = req.user.id;
    const { groupId } = req.params;

    const [error, vocabulary] = await getGroupVocabulary(userId, groupId);
    if (error) {
      res.status(error.status).send({ error: error.error });
    }

    res.send(vocabulary);
  } catch (e) {
    console.log(e.message);
    res.status(500).end();
  }
}

async function modifyVocabulary(req, res) {
  try {
    // get userId from request
    const userId = req.user.id;
    const { vocabularyId } = req.params;

    const [error, vocabulary] = await updateVocabulary(req.body, userId, vocabularyId);
    if (error) {
      res.status(error.status).send({ error: error.error });
    }

    res.send(vocabulary);
  } catch (e) {
    console.log(e.message);
    res.status(500).end();
  }
}

module.exports = {
  addVocabularyCard,
  deleteVocabularyCard,
  sendGroupVocabulary,
  modifyVocabulary,
};
