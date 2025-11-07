
const express = require('express');
const { body } = require('express-validator');
const tinDangController = require('../controllers/tinDangController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Validation rules
const tinDangValidation = [
  body('tieu_de')
    .isLength({ min: 10, max: 255 })
    .withMessage('Tiêu đề phải từ 10-255 ký tự'),
  body('loai_hinh')
    .isInt({ min: 1 })
    .withMessage('Loại hình không hợp lệ'),
  body('danh_muc')
    .isIn(['ban', 'cho_thue'])
    .withMessage('Danh mục không hợp lệ'),
  body('mo_ta')
    .isLength({ min: 50 })
    .withMessage('Mô tả phải ít nhất 50 ký tự'),
  body('gia')
    .isFloat({ min: 0 })
    .withMessage('Giá phải là số dương'),
  body('dia_chi')
    .notEmpty()
    .withMessage('Địa chỉ không được để trống')
];

// Routes
router.post('/', auth, upload.array('images', 10), tinDangValidation, tinDangController.taoTinDang);
router.get('/', tinDangController.getDanhSachTinDang);
router.get('/cua-toi', auth, tinDangController.getTinDangCuaToi);
router.get('/my-posts', auth, tinDangController.getTinDangCuaToi);
router.get('/:id', tinDangController.getTinDangById);
router.put('/:id', auth, upload.array('images', 10), tinDangValidation, tinDangController.capNhatTinDang);
router.delete('/:id', auth, tinDangController.xoaTinDang);

module.exports = router;