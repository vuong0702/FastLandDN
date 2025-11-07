const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Image = require('../models/Image');
const path = require('path');
const fs = require('fs');

// Helper to build public path from saved file
const toPublicPath = (filePath) => {
  // filePath is absolute or relative path like .../server/assets/avatars/filename
  // We want to return path starting with /assets/...
  const parts = filePath.split(path.sep);
  const assetsIndex = parts.lastIndexOf('assets');
  if (assetsIndex !== -1) {
    return '/' + parts.slice(assetsIndex).join('/');
  }
  return `/assets/others/${path.basename(filePath)}`;
};

// Upload image - accepts field 'image' (or other names handled by storage)
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn file để tải lên' });
    }

    // Determine loai_anh by upload destination
    const dest = req.file.destination || '';
    let loai_anh = 'bds';
    if (dest.toLowerCase().includes('avatars')) loai_anh = 'avatar';
    else if (dest.toLowerCase().includes('tindang')) loai_anh = 'bds';
    else loai_anh = 'other';

    const duong_dan_anh = toPublicPath(req.file.path);

    const imageDoc = new Image({
      loai_anh,
      tin_dang_id: req.body.tin_dang_id || null,
      nguoi_dung_id: req.body.nguoi_dung_id || null,
      duong_dan_anh,
      dung_luong: req.file.size
    });

    await imageDoc.save();

    res.status(201).json({
      success: true,
      message: 'Tải ảnh lên thành công',
      data: imageDoc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải ảnh lên',
      error: error.message
    });
  }
});

// Get all images
router.get('/', async (req, res) => {
  try {
    const images = await Image.find();
    res.json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách ảnh', error: error.message });
  }
});

// Get images by tin dang ID
router.get('/tindang/:id', async (req, res) => {
  try {
    const images = await Image.find({ tin_dang_id: req.params.id }).sort({ thu_tu: 1 });
    res.json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy ảnh tin đăng', error: error.message });
  }
});

// Delete image and file from disk
router.delete('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy ảnh' });
    }

    // Delete file from disk if exists
    if (image.duong_dan_anh) {
      // duong_dan_anh expected like '/assets/avatars/filename' or 'assets/avatars/filename'
      // Remove leading slashes to build a safe relative path
      const relPath = image.duong_dan_anh.replace(/^\/+/, '');
      const absPath = path.join(__dirname, '..', relPath);
      if (fs.existsSync(absPath)) {
        try {
          fs.unlinkSync(absPath);
        } catch (fsErr) {
          console.error('Không thể xóa file ảnh:', fsErr.message);
        }
      }
    }

    await Image.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Xóa ảnh thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa ảnh', error: error.message });
  }
});

module.exports = router;