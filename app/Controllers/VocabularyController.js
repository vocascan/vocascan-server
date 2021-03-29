const { createVocabularyCard, createTranslations } = require('../Services/VocabularyServiceProvider.js');

async function addVocabularyCard(req, res) {
  // get userId from request
  const { id } = await req.user;
  const { name, translations } = await req.body;
  const { languagePackageId } = await req.params;

  // check if user wants to train vocabulary card directly
  const activate = req.query.activate === 'true';

  // create vocabulary card
  const vocabularyCard = await createVocabularyCard(req.params, name, id, activate);

  // parse vocabulary card id from response and create translations
  await createTranslations(translations, id, languagePackageId, vocabularyCard.id);

  res.sendStatus(204);
}

module.exports = {
  addVocabularyCard,
};
