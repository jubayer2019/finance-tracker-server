const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateBudget } = require('../controllers/authController');
const { validateRegister } = require('../validations/authValidation');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', validateRegister, registerUser);
router.post('/login', loginUser);
router.put('/budget', protect, updateBudget);

module.exports = router;