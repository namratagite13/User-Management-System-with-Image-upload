
const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const uploadMiddleware = require('../middleware/upload-middleware');

const {uploadImage, fetchImageController, deleteImage} = require('../controllers/image-controller')

const router = express.Router();

router.post('/upload', authMiddleware, uploadMiddleware.single('image'), uploadImage);
router.get('/get-info', authMiddleware, adminMiddleware, fetchImageController);
router.delete('/:id', authMiddleware, adminMiddleware, deleteImage);


module.exports = router;