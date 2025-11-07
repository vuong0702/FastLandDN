
const express = require('express');
const staffController = require('../controllers/staffController');
const { auth, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Yêu cầu quyền nhân viên hoặc admin
router.use(auth, authorizeRoles('nhan_vien', 'quan_tri'));

router.get('/tin-dang', staffController.getDanhSachTinDangChoDuyet);
router.put('/tin-dang/:tinDangId/duyet', staffController.duyetTinDang);
router.get('/thong-ke', staffController.getThongKeDuyet);

module.exports = router;