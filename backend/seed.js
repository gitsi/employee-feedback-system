const mongoose = require('mongoose');
const Employee = require('./src/models/Employee');
const dotenv = require('dotenv');

dotenv.config();

const employees = [
    { name: 'Alice Johnson', email: 'alice@example.com', department: 'Engineering' },
    { name: 'Bob Smith', email: 'bob@example.com', department: 'Design' },
    { name: 'Charlie Davis', email: 'charlie@example.com', department: 'Product' },
    { name: 'Diana Prince', email: 'diana@example.com', department: 'Engineering' },
    { name: 'Ethan Hunt', email: 'ethan@example.com', department: 'Operations' },
    { name: 'Fiona Gallagher', email: 'fiona@example.com', department: 'HR' },
    { name: 'George Miller', email: 'george@example.com', department: 'Marketing' },
    { name: 'Hannah Abbott', email: 'hannah@example.com', department: 'Sales' },
    { name: 'Ian Wright', email: 'ian@example.com', department: 'Engineering' },
    { name: 'Jack Sparrow', email: 'jack@example.com', department: 'Product' },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Clear both collections to avoid dead references
        await require('./src/models/Feedback').deleteMany();
        await Employee.deleteMany();

        await Employee.insertMany(employees);
        console.log('Database Seeded (Employees & Feedback reset)!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
