
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  loai_anh: {
    type: String,
    enum: ['bds', 'avatar'],
    required: true
  },
  tin_dang_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TinDang'
  },
  nguoi_dung_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  duong_dan_anh: {
    type: String,
    required: true
  },
  thu_tu: {
    type: Number,
    default: 0
  },
  kich_thuoc_width: {
    type: Number
  },
  kich_thuoc_height: {
    type: Number
  },
  dung_luong: {
    type: Number
  },
  ngay_tao: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Image', imageSchema);