const express = require('express');
const {
    getProjects,
    getProject,
    createProject,
    deleteProject,
    likeProject,
    addComment
} = require('../controllers/projectController');

const router = express.Router();

const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload'); // Reusing existing upload middleware

// Public route to view projects
router.get('/', getProjects);
router.get('/:id', getProject);

// Protected routes to create and delete projects
router.post('/', protect, upload.array('images', 10), createProject);
router.delete('/:id', protect, deleteProject);
router.put('/:id/like', protect, likeProject);
router.post('/:id/comment', protect, addComment);

module.exports = router;
