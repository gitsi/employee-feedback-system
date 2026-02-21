const Employee = require('../models/Employee');

exports.createEmployee = async (req, res) => {
    try {
        const { name, email, department } = req.body;
        const employee = new Employee({ name, email, department });
        await employee.save();
        res.status(201).json(employee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getEmployees = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        const query = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { department: { $regex: search, $options: 'i' } }
            ]
        } : {};

        const total = await Employee.countDocuments(query);
        const employees = await Employee.find(query).skip(skip).limit(limit);

        res.json({
            employees,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: "Employee not found" });
        res.json(employee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
