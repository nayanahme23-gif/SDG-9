const express = require('express');
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    getCertificate,
    getEnrollment,
    updateProgress
} = require('../controllers/courseController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

const upload = require('../middleware/uploadMiddleware');

router
    .route('/')
    .get(getCourses)
    .post(protect, authorize('teacher', 'admin'), upload.single('image'), createCourse);

router
    .route('/:id')
    .get(getCourse)
    .put(protect, authorize('teacher', 'admin'), updateCourse)
    .delete(protect, authorize('teacher', 'admin'), deleteCourse);

// Progress Routes
router.route('/:id/enrollment').get(protect, getEnrollment);
router.route('/:id/progress').put(protect, updateProgress);
router.route('/:id/certificate').get(protect, getCertificate);
router.route('/:id/quiz').post(protect, require('../controllers/courseController').submitQuizResult);
router.route('/:id/analytics').get(protect, authorize('teacher', 'admin'), require('../controllers/courseController').getCourseAnalytics);

module.exports = router;
