const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const {
  updateProfileValidator,
  changePasswordValidator
} = require('../validators/authValidator');

router.use(protect); // Protect all user routes

router.get('/profile', getProfile);
router.put('/update-profile', updateProfileValidator, updateProfile);
router.put('/change-password', changePasswordValidator, changePassword);
router.delete('/delete-account', deleteAccount);

module.exports = router;
