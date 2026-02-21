const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

exports.employeeValidation = [
    body('name').trim().notEmpty().withMessage('Name is required').escape(),
    body('email').isEmail().withMessage('Enter a valid email').normalizeEmail(),
    body('department').notEmpty().withMessage('Department is required').escape(),
    validateRequest
];

exports.feedbackValidation = [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required').isLength({ max: 500 }).withMessage('Comment too long').escape(),
    body('givenBy').isMongoId().withMessage('Invalid giver ID'),
    body('givenTo').isMongoId().withMessage('Invalid recipient ID'),
    validateRequest
];
