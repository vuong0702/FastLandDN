
const User = require('../models/User');
const TinDang = require('../models/TinDang');

const getDanhSachUser = async (req, res) => {
  try {
    const { page = 1, limit = 10, vai_tro, trang_thai } = req.query;
    
    const filter = {};
    if (vai_tro) filter.vai_tro = vai_tro;
    if (trang_thai) filter.trang_thai = trang_thai;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select('-mat_khau')
      .sort({ ngay_tao: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Không cho phép khóa admin
    if (user.vai_tro === 'quan_tri') {
      return res.status(400).json({
        success: false,
        message: 'Không thể khóa tài khoản admin'
      });
    }

    user.trang_thai = user.trang_thai === 'unlock' ? 'lock' : 'unlock';
    await user.save();

    res.json({
      success: true,
      message: `${user.trang_thai === 'lock' ? 'Khóa' : 'Mở khóa'} tài khoản thành công`,
      data: {
        user: {
          id: user._id,
          ten_dang_nhap: user.ten_dang_nhap,
          trang_thai: user.trang_thai
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { vai_tro } = req.body;

    if (!['nguoi_dung', 'nhan_vien', 'quan_tri'].includes(vai_tro)) {
      return res.status(400).json({
        success: false,
        message: 'Vai trò không hợp lệ'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    user.vai_tro = vai_tro;
    await user.save();

    res.json({
      success: true,
      message: 'Cập nhật vai trò thành công',
      data: {
        user: {
          id: user._id,
          ten_dang_nhap: user.ten_dang_nhap,
          vai_tro: user.vai_tro
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

const getThongKe = async (req, res) => {
  try {
    const tongUser = await User.countDocuments();
    const tongTinDang = await TinDang.countDocuments();
    const tinDangChoDuyet = await TinDang.countDocuments({ trang_thai: 'cho_duyet' });
    const tinDangDaDuyet = await TinDang.countDocuments({ trang_thai: 'da_duyet' });
    const userBiKhoa = await User.countDocuments({ trang_thai: 'lock' });

    // Thống kê theo tháng
    const thongKeTheoThang = await TinDang.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$ngay_tao' },
            month: { $month: '$ngay_tao' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 }
      },
      {
        $limit: 12
      }
    ]);

    res.json({
      success: true,
      data: {
        tong_quan: {
          tong_user: tongUser,
          tong_tin_dang: tongTinDang,
          tin_dang_cho_duyet: tinDangChoDuyet,
          tin_dang_da_duyet: tinDangDaDuyet,
          user_bi_khoa: userBiKhoa
        },
        thong_ke_theo_thang: thongKeTheoThang
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

module.exports = {
  getDanhSachUser,
  toggleUserStatus,
  updateUserRole,
  getThongKe
};