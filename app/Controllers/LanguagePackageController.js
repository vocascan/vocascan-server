const { createLanguagePackage } = require('../Services/LanguagePackageProvider.js');
const {getJWT, getId} = require('../utils/index.js');

async function addLanguagePackage(req, res) {
    
    //get JWT from request
    const token = getJWT(req, res);

    //parse id from request and convert it to uuid
    const userId = await getId(token);

    //create language Package
    const languagePackage = await createLanguagePackage(req.body, userId);

    res.send(languagePackage);
    
}


module.exports = {
    addLanguagePackage
};
