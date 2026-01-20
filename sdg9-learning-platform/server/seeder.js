const mongoose = require('mongoose');
const dotenv = require('dotenv');
// colors is optional, removing dependency if not installed or keeping it simple
const User = require('./models/User');
const Course = require('./models/Course');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config.env' });

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Dummy Data
const users = [
    {
        name: 'Super Admin',
        email: 'admin@admin.com',
        password: 'admin123', // Will be hashed by pre-save hook
        role: 'admin',
        isApproved: true
    },
    {
        name: 'John Teacher',
        email: 'teacher@test.com',
        password: 'password123',
        role: 'teacher',
        isApproved: true
    },
    {
        name: 'Jane Student',
        email: 'student@test.com',
        password: 'password123',
        role: 'student',
        isApproved: true
    },
    {
        name: 'Pending User',
        email: 'pending@test.com',
        password: 'password123',
        role: 'student',
        isApproved: false
    }
];

const courses = [
    {
        title: 'SDG 9: Industry, Innovation and Infrastructure',
        description: 'Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation. Learn how AI and modern technology contribute to sustainable development.',
        image: 'https://placehold.co/800x600/1f2937/66fcf1?text=SDG+9+Infrastructure',
        content: [
            {
                title: 'Introduction to SDG 9',
                videoUrl: 'https://youtu.be/NU6rc_vm9rs?si=5T40LFBN56RInFbV',
                materialUrl: 'https://sdgs.un.org/goals/goal9'
            },
            {
                title: 'Sustainable Cities and Communities',
                videoUrl: 'https://youtu.be/qRf9ArbfkjU?si=jrgLoKWyqJLAy13f',
                materialUrl: 'https://example.com/sustainable-cities'
            }
        ]
    },
    {
        title: 'Structural Health Monitoring via AI',
        description: 'A comprehensive guide to using Artificial Intelligence for detecting and analyzing structural defects in concrete and building materials.',
        image: 'https://placehold.co/800x600/292524/f97316?text=AI+Structural+Health',
        content: [
            {
                title: 'AI in Civil Engineering',
                videoUrl: 'https://youtu.be/Za4NUJz99w8?si=EQKSEWq1ksvKtW-w',
                materialUrl: 'https://example.com/ai-notes'
            },
            {
                title: 'Case Study: Smart Infrastructure',
                videoUrl: 'https://youtu.be/xubK4T9Nc8A?si=-D_RVgX0QF3mpwic',
                materialUrl: 'https://example.com/case-study'
            }
        ]
    },
    {
        title: 'Modern Construction Technologies',
        description: 'Explore the latest advancements in construction technology and how they are shaping the future of infrastructure.',
        image: 'https://placehold.co/800x600/1e3a8a/38bdf8?text=Modern+Construction',
        content: [
            {
                title: 'Green Building Innovations',
                videoUrl: 'https://youtu.be/X5zHBCsz42I?si=by5-_N7Dw3rhxHEn',
                materialUrl: 'https://example.com/green-building'
            },
            {
                title: 'Future of Construction',
                videoUrl: 'https://youtu.be/xubK4T9Nc8A?si=Gv_fa_-WLfO5np89',
                materialUrl: 'https://example.com/future-construction'
            }
        ]
    }
];

// Import Data
const importData = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        await Course.deleteMany();

        console.log('Data Destroyed...');

        // Create Users
        const createdUsers = await User.create(users);
        const teacherUser = createdUsers.find(u => u.role === 'teacher');

        console.log('Users Imported...');

        // Add instructor to courses
        const coursesWithInstructor = courses.map(course => ({
            ...course,
            instructor: teacherUser._id
        }));

        await Course.create(coursesWithInstructor);

        console.log('Courses Imported...');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Delete Data
const deleteData = async () => {
    try {
        await User.deleteMany();
        await Course.deleteMany();
        console.log('Data Destroyed...');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
} else {
    console.log('Please provide options: -i (import) or -d (delete)');
    process.exit();
}
