const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');

router.post('/toggle/:device/:status', siteController.toggle);
router.get('/', siteController.index);

module.exports = router;
