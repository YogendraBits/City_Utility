const express = require('express');
const { registerUser, loginUser, getEmployees,getUserById,updateUser,deleteUser} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/employees', authMiddleware, getEmployees);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
