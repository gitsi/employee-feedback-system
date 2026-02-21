const Feedback = require('../models/Feedback');
const Employee = require('../models/Employee');

exports.submitFeedback = async (req, res) => {
    try {
        const { rating, comment, givenBy, givenTo } = req.body;

        if (givenBy === givenTo) {
            return res.status(400).json({ message: "Cannot give feedback to self" });
        }

        // Check for duplicate feedback within 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const existingFeedback = await Feedback.findOne({
            givenBy,
            givenTo,
            createdAt: { $gte: twentyFourHoursAgo }
        });

        if (existingFeedback) {
            return res.status(400).json({ message: "You can only give feedback to the same person once every 24 hours" });
        }

        const feedback = new Feedback({ rating, comment, givenBy, givenTo });
        await feedback.save();
        res.status(201).json(feedback);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({ isDeleted: { $ne: true } })
            .populate('givenBy', 'name')
            .populate('givenTo', 'name')
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getFeedbackReceived = async (req, res) => {
    try {
        const feedback = await Feedback.find({ givenTo: req.params.employeeId, isDeleted: { $ne: true } })
            .populate('givenBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getFeedbackGiven = async (req, res) => {
    try {
        const feedback = await Feedback.find({ givenBy: req.params.employeeId })
            .populate('givenTo', 'name email')
            .sort({ createdAt: -1 });
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAverageRating = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const employeeId = req.params.employeeId;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: "Invalid employee ID" });
        }

        const result = await Feedback.aggregate([
            {
                $match: {
                    givenTo: new mongoose.Types.ObjectId(employeeId),
                    isDeleted: { $ne: true }
                }
            },
            { $group: { _id: "$givenTo", averageRating: { $avg: "$rating" } } }
        ]);
        res.json(result[0] || { averageRating: 0 });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const { employeeId } = req.query;

        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) return res.status(404).json({ message: "Feedback not found" });

        if (feedback.givenBy.toString() !== employeeId) {
            return res.status(403).json({ message: "Only the giver can delete this feedback" });
        }

        // Perform Soft Delete
        feedback.isDeleted = true;
        feedback.deletedAt = new Date();
        await feedback.save();

        res.json({ message: "Feedback deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
