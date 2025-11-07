
const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Validation rules
const dangKyValidation = [
  body('ten_dang_nhap')
    .isLength({ min: 3, max: 50 })
    .withMessage('Tên đăng nhập phải từ 3-50 ký tự'),
  body('mat_khau')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải ít nhất 6 ký tự'),
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ'),
  body('ho_ten')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Họ tên không được quá 100 ký tự')
];

const dangNhapValidation = [
  body('ten_dang_nhap')
    .notEmpty()
    .withMessage('Tên đăng nhập không được để trống'),
  body('mat_khau')
    .notEmpty()
    .withMessage('Mật khẩu không được để trống')
];

// Routes
router.post('/dang-ky', dangKyValidation, userController.dangKy);
router.post('/dang-nhap', dangNhapValidation, userController.dangNhap);
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.post('/upload-avatar', auth, upload.single('avatar'), userController.uploadAvatar);

module.exports = router;