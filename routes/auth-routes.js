const express = require('express');
const router = express.Router();

const {registerUser, loginUser, changePassword, getUserProfile, updateUserProfile, deleteUser} = require('../controllers/auth-controller');
const authMiddleware = require('../middleware/auth-middleware')

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-password',authMiddleware, changePassword);
router.get('/user-profile',authMiddleware, getUserProfile);
router.get('/update-profile',authMiddleware, updateUserProfile);
router.delete('/delete-user/:id',authMiddleware, deleteUser);




module.exports = router;