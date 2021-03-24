const { createVocabularyCard, createTranslations } = require('../Services/VocabularyServiceProvider.js');

async function addVocabularyCard(req, res) {
  // get userId from request
  const { id } = await req.user;

  // check if user wants to train vocabulary card directly
  var activate = req.query.activate === 'true';

  // create vocabulary card
  const vocabularyCard = await createVocabularyCard(req.body, id, activate);

  // parse vocabulary card id from response and create translations
  Object.keys(req.body.translations).forEach((key) => {
    createTranslations(id, req.body.languagePackageId, vocabularyCard.id, req.body.translations[key].name);
  });

  res.send('Vocabulary added');
}

module.exports = {
  addVocabularyCard,
};
