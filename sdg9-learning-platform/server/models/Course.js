const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    image: {
        type: String, // Cloudinary URL
        default: 'no-photo.jpg'
    },
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    content: [
        {
            title: String,
            videoUrl: String,
            materialUrl: String
        }
    ],
    quizzes: [
        {
            question: {
                type: String,
                required: true
            },
            options: [
                {
                    type: String,
                    required: true
                }
            ],
            correctAnswer: {
                type: Number,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', courseSchema);
