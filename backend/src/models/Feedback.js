const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    givenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    givenTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    createdAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
