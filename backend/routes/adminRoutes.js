const express = require('express');
const router = express.Router();
const { getPlatformStats, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

router.use(protect);
router.use(admin);

router.get('/stats', getPlatformStats);
router.delete('/users/:id', deleteUser);

module.exports = router;
