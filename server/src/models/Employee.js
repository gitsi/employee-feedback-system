const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
}, { timestamps: true });

// Add text index for optimized search
EmployeeSchema.index({ name: 'text', department: 'text' });

module.exports = mongoose.model('Employee', EmployeeSchema);
