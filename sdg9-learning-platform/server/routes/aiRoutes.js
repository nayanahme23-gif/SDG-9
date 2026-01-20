const express = require('express');
const router = express.Router();
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configure Multer for temp uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'temp');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// @desc    Analyze uploaded image
// @route   POST /api/ai/analyze
// @access  Public (or Private)
router.post('/analyze', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No image uploaded' });
    }

    const imagePath = req.file.path;
    const scriptPath = path.join(__dirname, '..', 'scripts', 'predict.py');

    // Spawn Python process
    // Ensuring we use 'python' command (might need 'python3' on some systems, but 'python' is standard on Windows usually if user did strict setup)
    const pythonProcess = spawn('python', [scriptPath, imagePath]);

    let dataString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        // Cleanup file
        fs.unlink(imagePath, (err) => {
            if (err) console.error("Failed to delete temp file:", err);
        });

        if (code !== 0) {
            return res.status(500).json({ success: false, error: 'AI Analysis failed internally.' });
        }

        try {
            const result = JSON.parse(dataString);
            if (result.error) {
                return res.status(400).json({ success: false, error: result.error });
            }
            res.status(200).json({ success: true, data: result });
        } catch (e) {
            console.error("Failed to parse Python output:", dataString);
            res.status(500).json({ success: false, error: 'Failed to parse AI response.' });
        }
    });
});

module.exports = router;
