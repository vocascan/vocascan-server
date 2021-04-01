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
    const vocabularyCard = await createVocabularyCard(req.params, name, description, userId, activate, res);

    // parse vocabulary card id from response and create translations
    await createTranslations(translations, userId, languagePackageId, vocabularyCard.id, res);

    res.status(204).end();
  } catch (e) {
    res.status(500).end();
  }
}

async function deleteVocabularyCard(req, res) {
  // get userId from request
  const userId = req.user.id;
  const { vocabularyId } = req.params;

  await destroyVocabularyCard(userId, vocabularyId, res);

  res.status(204).end();
}

async function sendGroupVocabulary(req, res) {
  try {
    // get userId from request
    const userId = req.user.id;
    const { groupId } = req.params;

    const vocabulary = await getGroupVocabulary(userId, groupId, res);

    res.send(vocabulary);
  } catch (e) {
    res.status(500).end();
  }
}

async function modifyVocabulary(req, res) {
  try {
    // get userId from request
    const userId = req.user.id;
    const { vocabularyId } = req.params;

    const vocabulary = await updateVocabulary(req.body, userId, vocabularyId, res);

    res.send(vocabulary);
  } catch (e) {
    res.status(500).end();
  }
}

module.exports = {
  addVocabularyCard,
  deleteVocabularyCard,
  sendGroupVocabulary,
  modifyVocabulary,
};
