// models/TinDang.js
const mongoose = require('mongoose');

const tinDangSchema = new mongoose.Schema({
  nguoi_dung_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tieu_de: {
    type: String,
    required: true,
    maxlength: 255
  },
  loai_hinh: {
    type: Number,
    required: true
  },
  danh_muc: {
    type: String,
    enum: ['ban', 'cho_thue'],
    required: true
  },
  mo_ta: {
    type: String,
    required: true
  },
  gia: {
    type: Number,
    required: true,
    min: 0
  },
  dien_tich: {
    type: Number,
    min: 0
  },
  dia_chi: {
    type: String,
    required: true
  },
  so_phong_ngu: {
    type: Number,
    min: 0
  },
  so_phong_tam: {
    type: Number,
    min: 0
  },
  huong_nha: {
    type: String,
    maxlength: 50
  },
  trang_thai_phap_ly: {
    type: String,
    maxlength: 100
  },
  trang_thai: {
    type: String,
    enum: ['cho_duyet', 'da_duyet', 'tu_choi', 'het_han'],
    default: 'cho_duyet'
  },
  ngay_tao: {
    type: Date,
    default: Date.now
  },
  ngay_cap_nhat: {
    type: Date,
    default: Date.now
  },
  ngay_het_han: {
    type: Date
  }
});

// Update ngay_cap_nhat before saving
tinDangSchema.pre('save', function(next) {
  this.ngay_cap_nhat = new Date();
  next();
});

module.exports = mongoose.model('TinDang', tinDangSchema);