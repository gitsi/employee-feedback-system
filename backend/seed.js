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
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Employee.deleteMany();
        await Employee.insertMany(employees);
        console.log('Database Seeded!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
