const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');
const adminMiddleware = require("../middleware/adminMiddleware")
const router = express.Router();

// Protect all routes after this middleware

router.get('/me', authMiddleware.protect, userController.getMe);
router.patch('/update-me',authMiddleware.protect, userController.updateMe);
router.delete('/delete-me',authMiddleware.protect, userController.deleteMe);

// Only admin can access the routes after this middleware

router.get("/", adminMiddleware.protect, userController.getAllUsers);

router.route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;