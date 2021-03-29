const {
  createVocabularyCard,
  createTranslations,
  destroyVocabularyCard,
  getGroupVocabulary,
} = require('../Services/VocabularyServiceProvider.js');

async function addVocabularyCard(req, res) {
  // get userId from request
  const { id } = req.user;
  const { name, translations } = req.body;
  const { languagePackageId } = req.params;

  // check if user wants to train vocabulary card directly
  const activate = req.query.activate === 'true';

  // create vocabulary card
  const vocabularyCard = await createVocabularyCard(req.params, name, id, activate);

  // parse vocabulary card id from response and create translations
  await createTranslations(translations, id, languagePackageId, vocabularyCard.id);

  res.sendStatus(204);
}

async function deleteVocabularyCard(req, res) {
  // get userId from request
  const userId = req.user.id;
  const { vocabularyId } = req.params;

  destroyVocabularyCard(userId, vocabularyId);

  res.sendStatus(200);
}

async function sendGroupVocabulary(req, res) {
  // get userId from request
  const userId = req.user.id;
  const { groupId } = req.params;

  const vocabulary = await getGroupVocabulary(userId, groupId);

  res.send(vocabulary);
}

module.exports = {
  addVocabularyCard,
  deleteVocabularyCard,
  sendGroupVocabulary,
};
