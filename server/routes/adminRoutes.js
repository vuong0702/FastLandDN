
const express = require('express');
const adminController = require('../controllers/adminController');
const { auth, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Tất cả routes yêu cầu quyền admin
router.use(auth, authorizeRoles('quan_tri'));

router.get('/users', adminController.getDanhSachUser);
router.put('/users/:userId/toggle-status', adminController.toggleUserStatus);
router.put('/users/:userId/role', adminController.updateUserRole);
router.get('/thong-ke', adminController.getThongKe);

module.exports = router;