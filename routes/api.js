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
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.get('/auth', ProtectMiddleware, AuthController.profile);

router.post('/languagePackage/create', ProtectMiddleware, LanguagePackageController.addLanguagePackage);
router.get('/languagePackages', ProtectMiddleware, LanguagePackageController.sendLanguagePackages);

router.post('/:languagePackageId/group/create', ProtectMiddleware, GroupController.addGroup);
router.get('/:languagePackageId/groups', ProtectMiddleware, GroupController.sendGroups);

// Vocabulary
router.post('/vocabulary/create', ProtectMiddleware, VocabularyController.addVocabularyCard);

// Query
router.get('/:languagePackageId/query/start', ProtectMiddleware, QueryController.sendQueryVocabulary);
router.get('/:languagePackageId/query/unactivated/start', ProtectMiddleware, QueryController.sendUnactivatedVocabulary);
router.post('/query/:vocabularyId/check', ProtectMiddleware, QueryController.checkVocabulary);

// Docs
router.get('/swagger.json', DocsController.document);
router.use('/swagger', DocsController.swagger);

module.exports = router;
