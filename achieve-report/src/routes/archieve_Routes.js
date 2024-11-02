const express = require('express');
const { createReport, getReports } = require('../controllers/archieve_Controller');

const router = express.Router();

router.post('/', createReport);
router.get('/', getReports);

module.exports = router;
