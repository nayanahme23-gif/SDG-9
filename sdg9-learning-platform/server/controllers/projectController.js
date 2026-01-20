const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find().populate('user', 'name');

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id).populate('user', 'name');

        if (!project) {
            return res.status(404).json({ success: false, error: `Project not found with id of ${req.params.id}` });
        }

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res, next) => {
    try {
        req.body.user = req.user.id;

        // Check if images uploaded
        if (req.files) {
            req.body.images = req.files.map(file => file.path);
        }

        const project = await Project.create(req.body);

        res.status(201).json({
            success: true,
            data: project
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, error: `Project not found with id of ${req.params.id}` });
        }

        // Make sure user is project owner or admin
        if (project.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: `User ${req.user.id} is not authorized to delete this project` });
        }

        await project.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Like/Unlike project
// @route   PUT /api/projects/:id/like
// @access  Private
exports.likeProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Check if project has already been liked by user
        if (project.likes.includes(req.user.id)) {
            // Un-like
            const removeIndex = project.likes.indexOf(req.user.id);
            project.likes.splice(removeIndex, 1);
        } else {
            // Like
            project.likes.push(req.user.id);
        }

        await project.save();

        res.status(200).json({
            success: true,
            data: project.likes
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Add comment to project
// @route   POST /api/projects/:id/comment
// @access  Private
exports.addComment = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Check if user already commented
        if (project.comments.some(comment => comment.user.toString() === req.user.id)) {
            return res.status(400).json({ success: false, error: 'You have already commented on this project' });
        }

        const newComment = {
            text: req.body.text,
            name: req.user.name,
            user: req.user.id
        };

        project.comments.unshift(newComment);

        await project.save();

        res.status(200).json({
            success: true,
            data: project.comments
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
