const express = require('express');
const router = express.Router();
const superadminController = require('../controllers/superadminController');

router.post('/superadmins', superadminController.createSuperadmin);
router.put('/superadmins/:id', superadminController.updateSuperadmin);
router.get('/superadmins', superadminController.getAllSuperadmins);

module.exports = router;
