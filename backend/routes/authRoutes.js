const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, uploadProfileImage } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/profile/image', protect, upload.single('image'), uploadProfileImage);

module.exports = router;
