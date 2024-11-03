const express = require('express');
const { registerUser, loginUser, getEmployees,getUserById} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/employees', authMiddleware, getEmployees);
router.get('/:id', getUserById);

module.exports = router;
