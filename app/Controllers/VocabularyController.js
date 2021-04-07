const {
  createVocabularyCard,
  createTranslations,
  destroyVocabularyCard,
  getGroupVocabulary,
  updateVocabulary,
} = require('../Services/VocabularyServiceProvider.js');
const catchAsync = require('../utils/catchAsync');

const addVocabularyCard = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;
  const { name, description, translations } = req.body;
  const { languagePackageId } = req.params;

  // check if user wants to train vocabulary card directly
  const activate = req.query.activate === 'true';

  // create vocabulary card
  const vocabularyCard = await createVocabularyCard(req.params, name, description, userId, activate);

  // parse vocabulary card id from response and create translations
  await createTranslations(translations, userId, languagePackageId, vocabularyCard.id);

  vocabularyCard.translations = translations;

  res.send(vocabularyCard);
});

const deleteVocabularyCard = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;
  const { vocabularyId } = req.params;

  await destroyVocabularyCard(userId, vocabularyId);

  res.status(204).end();
});

const sendGroupVocabulary = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;
  const { groupId } = req.params;

  const vocabulary = await getGroupVocabulary(userId, groupId);

  res.send(vocabulary);
});

const modifyVocabulary = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;
  const { vocabularyId } = req.params;

  const vocabulary = await updateVocabulary(req.body, userId, vocabularyId);

  res.send(vocabulary);
});

module.exports = {
  addVocabularyCard,
  deleteVocabularyCard,
  sendGroupVocabulary,
  modifyVocabulary,
};
