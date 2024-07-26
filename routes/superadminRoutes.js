const express = require('express');
const router = express.Router();
const superadminController = require('../controllers/superadminController');

router.post('/superadmins', superadminController.createSuperadmin);
router.put('/superadmins/:id', superadminController.updateSuperadmin);

module.exports = router;
