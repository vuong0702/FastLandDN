
const User = require('../models/User');
const Image = require('../models/Image');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

const dangKy = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const { ten_dang_nhap, mat_khau, email, so_dien_thoai, ho_ten } = req.body;

    // Kiểm tra user đã tồn tại
    const existingUser = await User.findOne({
      $or: [{ email }, { ten_dang_nhap }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email hoặc tên đăng nhập đã tồn tại'
      });
    }

    const user = new User({
      ten_dang_nhap,
      mat_khau,
      email,
      so_dien_thoai,
      ho_ten
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        user: {
          id: user._id,
          ten_dang_nhap: user.ten_dang_nhap,
          email: user.email,
          ho_ten: user.ho_ten,
          vai_tro: user.vai_tro
        },
        token
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

const dangNhap = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const { ten_dang_nhap, mat_khau } = req.body;

    const user = await User.findOne({ ten_dang_nhap });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng'
      });
    }

    if (user.trang_thai === 'lock') {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản đã bị khóa'
      });
    }

    const isMatch = await user.comparePassword(mat_khau);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          id: user._id,
          ten_dang_nhap: user.ten_dang_nhap,
          email: user.email,
          ho_ten: user.ho_ten,
          vai_tro: user.vai_tro
        },
        token
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

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-mat_khau');
    const avatar = await Image.findOne({ 
      nguoi_dung_id: req.user._id, 
      loai_anh: 'avatar' 
    });

    res.json({
      success: true,
      data: {
        user,
        avatar: avatar ? avatar.duong_dan_anh : null
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

const updateProfile = async (req, res) => {
  try {
    const { ho_ten, email, so_dien_thoai, dia_chi } = req.body;
    const user = await User.findById(req.user._id);

    // Kiểm tra email mới nếu có thay đổi
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email đã tồn tại'
        });
      }
      user.email = email;
    }

    // Cập nhật các trường thông tin
    if (ho_ten !== undefined) user.ho_ten = ho_ten;
    if (so_dien_thoai !== undefined) user.so_dien_thoai = so_dien_thoai;
    if (dia_chi !== undefined) user.dia_chi = dia_chi;

    await user.save();

    // Lấy avatar của user
    const avatar = await Image.findOne({ 
      nguoi_dung_id: req.user._id, 
      loai_anh: 'avatar' 
    });

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: {
        id: user._id,
        ten_dang_nhap: user.ten_dang_nhap,
        email: user.email,
        ho_ten: user.ho_ten,
        so_dien_thoai: user.so_dien_thoai,
        dia_chi: user.dia_chi,
        vai_tro: user.vai_tro,
        avatar: avatar ? avatar.duong_dan_anh : null
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

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file ảnh'
      });
    }

    // Xóa avatar cũ
    await Image.deleteMany({ 
      nguoi_dung_id: req.user._id, 
      loai_anh: 'avatar' 
    });

    const image = new Image({
      loai_anh: 'avatar',
      nguoi_dung_id: req.user._id,
      duong_dan_anh: `/assets/avatars/${req.file.filename}`,
      dung_luong: req.file.size
    });

    await image.save();

    res.json({
      success: true,
      message: 'Upload avatar thành công',
      data: {
        duong_dan_anh: image.duong_dan_anh
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
  dangKy,
  dangNhap,
  getProfile,
  updateProfile,
  uploadAvatar
};