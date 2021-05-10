const { Language } = require('../../database');

async function getAllLanguages(attributes = ['code', 'name', 'nativeNames', 'rtl']) {
  if (attributes.length === 0) {
    return [];
  }

  const languages = await Language.findAll({
    attributes,
  });

  return languages.map((language) => {
    const lang = language.toJSON();

    if (attributes.includes('nativeNames')) {
      return { ...lang, nativeNames: lang.nativeNames.split(',') };
    }

    return lang;
  });
}

module.exports = {
  getAllLanguages,
};
