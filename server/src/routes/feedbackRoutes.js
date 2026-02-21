const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { feedbackValidation } = require('../middleware/validation');

router.get('/', feedbackController.getAllFeedback);
router.post('/', feedbackValidation, feedbackController.submitFeedback);
router.get('/received/:employeeId', feedbackController.getFeedbackReceived);
router.get('/given/:employeeId', feedbackController.getFeedbackGiven);
router.get('/average/:employeeId', feedbackController.getAverageRating);
router.delete('/:feedbackId', feedbackController.deleteFeedback);

module.exports = router;
