// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục assets nếu chưa tồn tại
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Mặc định lưu vào thư mục chung
    let uploadPath = path.join(__dirname, '../assets/others');

    // Hướng tới thư mục avatars nếu fieldname chứa 'avatar'
    if (file.fieldname && file.fieldname.toLowerCase().includes('avatar')) {
      uploadPath = path.join(__dirname, '../assets/avatars');
    } else if (file.fieldname && (file.fieldname.toLowerCase().includes('image') || file.fieldname.toLowerCase().includes('images') || file.fieldname.toLowerCase().includes('tindang'))) {
      // Các tên field liên quan ảnh tin đăng
      uploadPath = path.join(__dirname, '../assets/tindang');
    }

    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép upload file ảnh (JPEG, JPG, PNG, GIF)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

module.exports = upload;