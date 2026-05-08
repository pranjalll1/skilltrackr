const express = require('express');
const router = express.Router();
const {
  generateAssessment,
  getAssessment,
  submitAssessment,
  getDashboardStats,
  getAllAssessments
} = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All assessment routes are protected

router.post('/generate', generateAssessment);
router.get('/stats', getDashboardStats);
router.get('/', getAllAssessments);
router.route('/:id')
  .get(getAssessment)
  .put(submitAssessment); // PUT for submitting

module.exports = router;
