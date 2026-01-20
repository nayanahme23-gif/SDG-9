const User = require('../models/User');

// @desc    Get all users (with optional approval status filter)
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
    try {
        const { approved } = req.query;
        let query = {};

        if (approved !== undefined) {
            query.isApproved = approved === 'true';
        }

        const users = await User.find(query);

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Approve a user
// @route   PUT /api/admin/users/:id/approve
// @access  Private (Admin)
exports.approveUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: user,
            message: `User ${user.name} approved successfully.`
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
