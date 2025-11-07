
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  ten_dang_nhap: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  mat_khau: {
    type: String,
    required: true,
    minlength: 6
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  so_dien_thoai: {
    type: String,
    maxlength: 15
  },
  ho_ten: {
    type: String,
    maxlength: 100
  },
  dia_chi: {
    type: String,
    maxlength: 500
  },
  vai_tro: {
    type: String,
    enum: ['nguoi_dung', 'nhan_vien', 'quan_tri'],
    default: 'nguoi_dung'
  },
  trang_thai: {
    type: String,
    enum: ['unlock', 'lock'],
    default: 'unlock'
  },
  ngay_tao: {
    type: Date,
    default: Date.now
  },
  ngay_cap_nhat: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('mat_khau')) return next();
  this.mat_khau = await bcrypt.hash(this.mat_khau, 12);
  next();
});

// Update ngay_cap_nhat before saving
userSchema.pre('save', function(next) {
  this.ngay_cap_nhat = new Date();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.mat_khau);
};

module.exports = mongoose.model('User', userSchema);