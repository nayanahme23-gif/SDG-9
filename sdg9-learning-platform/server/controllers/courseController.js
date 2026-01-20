const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find().populate('instructor', 'name email');

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'name email');

        if (!course) {
            return res.status(404).json({ success: false, error: `Course not found with id of ${req.params.id}` });
        }

        res.status(200).json({ success: true, data: course });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Teacher/Admin)
exports.createCourse = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.instructor = req.user.id;

        // Check if image uploaded
        if (req.file) {
            req.body.image = req.file.path;
        }

        const course = await Course.create(req.body);

        res.status(201).json({
            success: true,
            data: course
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Teacher/Admin)
exports.updateCourse = async (req, res, next) => {
    try {
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, error: `Course not found with id of ${req.params.id}` });
        }

        // Make sure user is course owner
        // if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
        //   return res.status(401).json({ success: false, error: `User ${req.user.id} is not authorized to update this course` });
        // }

        course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: course });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Teacher/Admin)
exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, error: `Course not found with id of ${req.params.id}` });
        }

        // Make sure user is course owner
        // if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
        //   return res.status(401).json({ success: false, error: `User ${req.user.id} is not authorized to delete this course` });
        // }

        await course.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
// @desc    Get user enrollment status for a course
// @route   GET /api/courses/:id/enrollment
// @access  Private
exports.getEnrollment = async (req, res, next) => {
    try {
        let enrollment = await Enrollment.findOne({ course: req.params.id, user: req.user.id });

        if (!enrollment) {
            // Return empty/null if not enrolled (or auto-enroll logic if you prefer)
            return res.status(200).json({ success: true, data: null });
        }

        res.status(200).json({ success: true, data: enrollment });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update Module Progress
// @route   PUT /api/courses/:id/progress
// @access  Private
exports.updateProgress = async (req, res, next) => {
    try {
        const { moduleIndex } = req.body; // e.g., 0, 1, 2...

        // Find or Create Enrollment
        let enrollment = await Enrollment.findOne({ course: req.params.id, user: req.user.id });

        if (!enrollment) {
            enrollment = await Enrollment.create({
                course: req.params.id,
                user: req.user.id,
                completedModules: []
            });
        }

        // Add module if not already there
        if (!enrollment.completedModules.includes(String(moduleIndex))) {
            enrollment.completedModules.push(String(moduleIndex));
        }

        // Check completion logic
        const course = await Course.findById(req.params.id);
        if (enrollment.completedModules.length === course.content.length) {
            enrollment.isCompleted = true;
        }

        await enrollment.save();

        res.status(200).json({
            success: true,
            data: enrollment
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Download Certificate
// @route   GET /api/courses/:id/certificate
// @access  Private
exports.getCertificate = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, error: 'Course not found' });
        }

        // Check Enrollment Completion
        const enrollment = await Enrollment.findOne({ course: req.params.id, user: req.user.id });

        // If trying to bypass frontend check
        if (!enrollment || !enrollment.isCompleted) {
            // For Admin/Teacher, maybe allow bypass? Let's keep strict for now or allow Admin.
            if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
                return res.status(403).json({ success: false, error: 'You must complete the course to download the certificate.' });
            }
        }

        // Create PDF
        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=certificate-${req.params.id}.pdf`);

        doc.pipe(res);

        // Design Certificate
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f0f9ff');
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).strokeColor('#45a29e').lineWidth(5).stroke();

        doc.font('Helvetica-Bold').fontSize(40).fillColor('#0b0c10').text('Certificate of Completion', 0, 100, { align: 'center' });
        doc.moveDown();
        doc.font('Helvetica').fontSize(20).fillColor('#1f2833').text('This is to certify that', { align: 'center' });
        doc.moveDown();

        doc.font('Helvetica-Bold').fontSize(35).fillColor('#45a29e').text(req.user.name, { align: 'center' });
        doc.moveDown();

        doc.font('Helvetica').fontSize(20).fillColor('#1f2833').text('Has successfully completed the course', { align: 'center' });
        doc.moveDown();

        doc.font('Helvetica-Bold').fontSize(30).fillColor('#0b0c10').text(course.title, { align: 'center' });
        doc.moveDown();
        doc.moveDown();

        doc.font('Helvetica').fontSize(15).fillColor('#66fcf1').text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });

        doc.end();

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
