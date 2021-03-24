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
router.get('/auth', ProtectMiddleware, AuthController.profile);

router.post('/languagePackage', ProtectMiddleware, LanguagePackageController.addLanguagePackage);
router.get('/languagePackage', ProtectMiddleware, LanguagePackageController.sendLanguagePackages);

router.post('/languagePackage/:id/group', ProtectMiddleware, GroupController.addGroup);
router.get('/:languagePackage/:id/group', ProtectMiddleware, GroupController.sendGroups);

// Vocabulary
router.post(
  '/languagePackage/:languagePackageId/group/:groupId/vocabulary',
  ProtectMiddleware,
  VocabularyController.addVocabularyCard
);

// Query
router.get('/languagePackage/:languagePackageId/query', ProtectMiddleware, QueryController.sendQueryVocabulary);
router.get(
  '/languagePackage/:languagePackageId/query/staged',
  ProtectMiddleware,
  QueryController.sendUnactivatedVocabulary
);
router.post('/vocabulary/:id', ProtectMiddleware, QueryController.checkVocabulary);

// Docs
router.get('/swagger.json', DocsController.document);
router.use('/swagger', DocsController.swagger);

module.exports = router;
