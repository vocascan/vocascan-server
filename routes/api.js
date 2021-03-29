const express = require('express');

// MIDDLEWARE
const ProtectMiddleware = require('../app/Middleware/ProtectMiddleware');

// CONTROLLER
const AuthController = require('../app/Controllers/AuthController.js');
const LanguagePackageController = require('../app/Controllers/LanguagePackageController.js');
const GroupController = require('../app/Controllers/GroupController.js');
const VocabularyController = require('../app/Controllers/VocabularyController.js');
const QueryController = require('../app/Controllers/QueryController.js');
const DocsController = require('../app/Controllers/DocsController');

const router = express.Router();

// AUTH
router.post('/user/register', AuthController.register);
router.post('/user/login', AuthController.login);
router.get('/user', ProtectMiddleware, AuthController.profile);
router.delete('/user', ProtectMiddleware, AuthController.deleteUser);

// Language package
router.post('/languagePackage', ProtectMiddleware, LanguagePackageController.addLanguagePackage);
router.get('/languagePackage', ProtectMiddleware, LanguagePackageController.sendLanguagePackages);
router.delete(
  '/languagePackage/:languagePackageId',
  ProtectMiddleware,
  LanguagePackageController.deleteLanguagePackage
);

// Group
router.post('/languagePackage/:languagePackageId/group', ProtectMiddleware, GroupController.addGroup);
router.get('/languagePackage/:languagePackageId/group', ProtectMiddleware, GroupController.sendGroups);
router.delete('/group/:groupId', ProtectMiddleware, GroupController.deleteGroup);

// Vocabulary
router.post(
  '/languagePackage/:languagePackageId/group/:groupId/vocabulary',
  ProtectMiddleware,
  VocabularyController.addVocabularyCard
);
router.delete('/vocabulary/:vocabularyId', ProtectMiddleware, VocabularyController.deleteVocabularyCard);
router.get('/group/:groupId/vocabulary', ProtectMiddleware, VocabularyController.sendGroupVocabulary);

// Query
router.get('/languagePackage/:languagePackageId/query', ProtectMiddleware, QueryController.sendQueryVocabulary);

router.patch('/vocabulary/:vocabularyId', ProtectMiddleware, QueryController.checkVocabulary);

// Docs
router.get('/swagger.json', DocsController.document);
router.use('/swagger', DocsController.swagger);

module.exports = router;
