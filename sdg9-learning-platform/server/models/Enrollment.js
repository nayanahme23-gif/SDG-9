const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true
    },
    completedModules: {
        type: [String], // Array of module Indices or IDs
        default: []
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    quizScores: [{
        quizIndex: Number,
        score: Number,
        totalQuestions: Number,
        submittedAt: {
            type: Date,
            default: Date.now
        }
    }]
});

// Prevent multiple enrollments for same course/user
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
