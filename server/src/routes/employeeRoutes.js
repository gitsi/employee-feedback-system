const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { employeeValidation } = require('../middleware/validation');

router.post('/', employeeValidation, employeeController.createEmployee);
router.get('/', employeeController.getEmployees);
router.get('/:id', employeeController.getEmployeeById);

module.exports = router;
