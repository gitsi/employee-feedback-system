const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Rate Limiter: 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: "Too many requests from this IP, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
});

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(limiter);
app.use(helmet());
app.use(express.json({ limit: '10kb' }));

// Health Check / Debug Route
app.get('/api/health', async (req, res) => {
    try {
        const count = await require('./models/Employee').countDocuments();
        res.json({ status: 'ok', employeeCount: count });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Routes
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
