const mongoose = require('mongoose');
const dotenv = require('dotenv');
// colors is optional, removing dependency if not installed or keeping it simple
const User = require('./models/User');
const Course = require('./models/Course');
const Project = require('./models/Project');
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
                videoUrl: 'https://youtu.be/qRfArbfkjU?si=jrgLoKWyqJLAy13f',
                materialUrl: 'https://example.com/sustainable-cities'
            }
        ],
        quizzes: [
            {
                question: "What is the primary goal of SDG 9?",
                options: ["To eradicate poverty", "To build resilient infrastructure", "To promote gender equality", "To protect marine life"],
                correctAnswer: 1
            },
            {
                question: "Which technology is a key driver for sustainable industrialization?",
                options: ["Steam Engine", "AI and Automation", "Typewriter", "Telescope"],
                correctAnswer: 1
            },
            {
                question: "Innovation in infrastructure leads to:",
                options: ["Economic Growth", "Environmental Degradation", "Resource Depletion", "Higher Unemployment"],
                correctAnswer: 0
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
        ],
        quizzes: [
            {
                question: "Which AI technique is commonly used for crack detection?",
                options: ["Natural Language Processing", "Computer Vision (CNN)", "Reinforcement Learning", "Market Basket Analysis"],
                correctAnswer: 1
            },
            {
                question: "Why is early crack detection important?",
                options: ["It looks better", "Prevents structural failure", "Increases property tax", "It's a legal requirement"],
                correctAnswer: 1
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
        ],
        quizzes: [
            {
                question: "What is a benefit of green building?",
                options: ["High energy consumption", "Reduced carbon footprint", "Increased waste", "Shorter lifespan"],
                correctAnswer: 1
            },
            {
                question: "Smart cities utilize what to improve efficiency?",
                options: ["Paper records", "IoT Sensors", "Analog Phones", "Diesel Generators"],
                correctAnswer: 1
            }
        ]
    }
];

const projects = [
    {
        title: 'Smart Energy Grid Monitor',
        description: 'An IoT-based system to monitor energy consumption in real-time and optimize distribution for sustainable communities.',
        images: ['https://placehold.co/800x600/312e81/818cf8?text=Energy+Grid', 'https://placehold.co/800x600/1e1b4b/4338ca?text=Grid+Dashboard'],
        liveLink: 'https://smart-grid-demo.vercel.app'
    },
    {
        title: 'Waste Management AI',
        description: 'Computer vision application that automatically classifies waste into recyclable and non-recyclable categories to improve processing efficiency.',
        images: ['https://placehold.co/800x600/064e3b/34d399?text=Waste+AI', 'https://placehold.co/800x600/065f46/10b981?text=Detection+Demo']
    },
    {
        title: 'Resilient Bridge Design',
        description: 'A structural engineering project proposing a new bridge design capable of withstanding high-magnitude earthquakes using flexible materials.',
        images: ['https://placehold.co/800x600/7c2d12/fb923c?text=Bridge+Design', 'https://placehold.co/800x600/451a03/d97706?text=Stress+Analysis'],
        liveLink: 'https://bridge-design-sim.netlify.app'
    },
    {
        title: 'Rural Connectivity Drone',
        description: 'Prototype of a solar-powered drone designed to provide temporary internet connectivity to remote areas during infrastructure development.',
        images: ['https://placehold.co/800x600/831843/f472b6?text=Solar+Drone', 'https://placehold.co/800x600/500724/db2777?text=Flight+Path'],
        liveLink: 'https://drone-flight-log.herokuapp.com'
    },
    {
        title: 'Eco-Friendly Cement Formula',
        description: 'Research project developing a biological cement alternative that reduces CO2 emissions by 40% using industrial byproducts.',
        images: ['https://placehold.co/800x600/14532d/86efac?text=Green+Cement', 'https://placehold.co/800x600/14532d/4ade80?text=Lab+Results']
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

        // Create Projects (Assigned to Student)
        const studentUser = createdUsers.find(u => u.role === 'student');
        const projectsWithUser = projects.map(project => ({
            ...project,
            user: studentUser._id
        }));

        await Project.create(projectsWithUser);

        console.log('Projects Imported...');

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
        await Project.deleteMany();
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
