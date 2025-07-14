const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  getMe,
  logout
} = require('../controllers/adminController');

const adminMiddleware = require("../middleware/adminMiddleware");

// router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/me',adminMiddleware.protect, getMe);
router.get('/logout',adminMiddleware.protect, logout);

module.exports = router;