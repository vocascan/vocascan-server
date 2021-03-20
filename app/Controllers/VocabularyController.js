const { createVocabularyCard, createTranslations } = require('../Services/VocabularyServiceProvider.js');
const { parseTokenUserId } = require('../utils/index.js');

async function addVocabularyCard(req, res) {
  // get userId from request
  const userId = await parseTokenUserId(req);

  // create vocabulary card
  const vocabularyCard = await createVocabularyCard(req.body, userId);

  // parse vocabulary card id from response and create translations
  Object.keys(req.body.translations).forEach((key) => {
    createTranslations(userId, req.body.languagePackageId, vocabularyCard.id, req.body.translations[key].name);
  });

  res.send('Vocabulary added');
}

module.exports = {
  addVocabularyCard,
};
