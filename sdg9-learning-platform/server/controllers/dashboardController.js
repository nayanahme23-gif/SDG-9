const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardData = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        let dashboardData = {
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        };

        if (user.role === 'teacher' || user.role === 'admin') {
            const totalStudents = await User.countDocuments({ role: 'student' });
            dashboardData.totalStudents = totalStudents;

            if (user.role === 'admin') {
                const totalCourses = await Course.countDocuments();
                const allCourses = await Course.find();
                dashboardData.coursesCreated = totalCourses;
                dashboardData.courses = allCourses;
            } else {
                // Teacher
                const courses = await Course.find({ instructor: req.user.id });
                dashboardData.coursesCreated = courses.length;
                dashboardData.courses = courses;
            }
        } else {
            // For student: Return all courses available in the platform
            const allCourses = await Course.find();
            dashboardData.courses = allCourses;
            dashboardData.enrolledCourses = []; // Can implement specific enrollment logic later
            dashboardData.completedTests = 0;
        }

        res.status(200).json({
            success: true,
            data: dashboardData
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
