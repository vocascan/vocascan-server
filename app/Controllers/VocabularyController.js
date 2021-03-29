const {
  createVocabularyCard,
  createTranslations,
  destroyVocabularyCard,
  getGroupVocabulary,
  updateVocabulary,
} = require('../Services/VocabularyServiceProvider.js');

async function addVocabularyCard(req, res) {
  // get userId from request
  const userId = req.user.id;
  const { name, translations } = req.body;
  const { languagePackageId } = req.params;

  // check if user wants to train vocabulary card directly
  const activate = req.query.activate === 'true';

  // create vocabulary card
  const vocabularyCard = await createVocabularyCard(req.params, name, userId, activate);

  // parse vocabulary card id from response and create translations
  await createTranslations(translations, userId, languagePackageId, vocabularyCard.id);

  res.status(204).end();
}

async function deleteVocabularyCard(req, res) {
  // get userId from request
  const { id } = req.user;
  const { vocabularyId } = req.params;

  await destroyVocabularyCard(userId, vocabularyId);

  res.status(204).end();
}

async function sendGroupVocabulary(req, res) {
  // get userId from request
  const { id } = req.user;
  const { groupId } = req.params;

  const vocabulary = await getGroupVocabulary(id, groupId);

  res.send(vocabulary);
}

async function modifyVocabulary(req, res) {
  // get userId from request
  const { id } = req.user;
  const { vocabularyId } = req.params;

  const vocabulary = await updateVocabulary(req.body, id, vocabularyId);

  res.send(vocabulary);
}

module.exports = {
  addVocabularyCard,
  deleteVocabularyCard,
  sendGroupVocabulary,
  modifyVocabulary,
};
