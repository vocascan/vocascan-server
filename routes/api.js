const express = require('express');

// MIDDLEWARE
const ProtectMiddleware = require('../app/Middleware/ProtectMiddleware');

// CONTROLLER
const AuthController = require('../app/Controllers/AuthController.js');
const LanguagePackageController = require('../app/Controllers/LanguagePackageController.js');
const GroupController = require('../app/Controllers/GroupController.js');
const VocabularyController = require('../app/Controllers/VocabularyController.js');
const QueryController = require('../app/Controllers/QueryController.js');
const { Query } = require('pg');

const router = express.Router();

// AUTH
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.get('/auth', ProtectMiddleware, AuthController.profile);

router.post('/languagePackage/create', ProtectMiddleware, LanguagePackageController.addLanguagePackage);
router.get('/languagePackages', ProtectMiddleware, LanguagePackageController.sendLanguagePackages);

router.post('/:languagePackageId/group/create', ProtectMiddleware, GroupController.addGroup);
router.get('/:languagePackageId/groups', ProtectMiddleware, GroupController.sendGroups);

router.post('/vocabulary/create', ProtectMiddleware, VocabularyController.addVocabularyCard);

router.get('/:languagePackageId/query/start', ProtectMiddleware, QueryController.sendQueryVocabulary);

module.exports = router;
