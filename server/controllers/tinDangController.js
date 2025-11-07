
const TinDang = require('../models/TinDang');
const Image = require('../models/Image');
const { validationResult } = require('express-validator');

const taoTinDang = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const tinDang = new TinDang({
      ...req.body,
      nguoi_dung_id: req.user._id
    });

    await tinDang.save();

    // Xử lý upload ảnh nếu có
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map((file, index) => {
        const image = new Image({
          loai_anh: 'bds',
          tin_dang_id: tinDang._id,
          duong_dan_anh: `/assets/tindang/${file.filename}`,
          thu_tu: index,
          dung_luong: file.size
        });
        return image.save();
      });

      await Promise.all(imagePromises);
    }

    const populatedTinDang = await TinDang.findById(tinDang._id)
      .populate('nguoi_dung_id', 'ho_ten email');

    res.status(201).json({
      success: true,
      message: 'Tạo tin đăng thành công',
      data: populatedTinDang
    });
  } catch (error) {
    console.error('Error in capNhatTinDang:', error);
    
    // Xử lý các loại lỗi cụ thể
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        error: error.message
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID tin đăng không hợp lệ'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Có lỗi xảy ra'
    });
  }
};

const getDanhSachTinDang = async (req, res) => {
  try {
    const { page = 1, limit = 10, danh_muc, trang_thai, gia_min, gia_max } = req.query;
    
    const filter = {
      // Chỉ hiển thị tin đăng đã được duyệt trên trang chủ
      trang_thai: trang_thai || 'da_duyet'
    };
    if (danh_muc) filter.danh_muc = danh_muc;
    if (gia_min || gia_max) {
      filter.gia = {};
      if (gia_min) filter.gia.$gte = parseFloat(gia_min);
      if (gia_max) filter.gia.$lte = parseFloat(gia_max);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tinDangs = await TinDang.find(filter)
      .populate('nguoi_dung_id', 'ho_ten email')
      .sort({ ngay_tao: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Lấy ảnh và avatar cho mỗi tin đăng
    const tinDangWithImages = await Promise.all(
      tinDangs.map(async (tinDang) => {
        const images = await Image.find({ 
          tin_dang_id: tinDang._id, 
          loai_anh: 'bds' 
        }).sort({ thu_tu: 1 });
        
        // Lấy avatar của người dùng
        let tinDangObj = tinDang.toObject();
        if (tinDangObj.nguoi_dung_id && tinDangObj.nguoi_dung_id._id) {
          const avatar = await Image.findOne({
            nguoi_dung_id: tinDangObj.nguoi_dung_id._id,
            loai_anh: 'avatar'
          });
          
          if (avatar) {
            tinDangObj.nguoi_dung_id.avatar = avatar.duong_dan_anh;
          }
        }
        
        return {
          ...tinDangObj,
          images: images.map(img => img.duong_dan_anh)
        };
      })
    );

    const total = await TinDang.countDocuments(filter);

    res.json({
      success: true,
      data: {
        tinDangs: tinDangWithImages,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error in capNhatTinDang:', error);
    
    // Xử lý các loại lỗi cụ thể
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        error: error.message
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID tin đăng không hợp lệ'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Có lỗi xảy ra'
    });
  }
};

const getTinDangCuaToi = async (req, res) => {
  try {
    const { page = 1, limit = 10, trang_thai } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Tạo filter object
    const filter = { nguoi_dung_id: req.user._id };
    
    // Thêm filter theo trạng thái nếu có
    if (trang_thai) {
      filter.trang_thai = trang_thai;
    }

    const tinDangs = await TinDang.find(filter)
      .sort({ ngay_tao: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Lấy ảnh và avatar cho mỗi tin đăng
    const tinDangWithImages = await Promise.all(
      tinDangs.map(async (tinDang) => {
        const images = await Image.find({ 
          tin_dang_id: tinDang._id, 
          loai_anh: 'bds' 
        }).sort({ thu_tu: 1 });
        
        // Lấy avatar của người dùng
        let tinDangObj = tinDang.toObject();
        if (tinDangObj.nguoi_dung_id && tinDangObj.nguoi_dung_id._id) {
          const avatar = await Image.findOne({
            nguoi_dung_id: tinDangObj.nguoi_dung_id._id,
            loai_anh: 'avatar'
          });
          
          if (avatar) {
            tinDangObj.nguoi_dung_id.avatar = avatar.duong_dan_anh;
          }
        }
        
        return {
          ...tinDangObj,
          images: images.map(img => img.duong_dan_anh)
        };
      })
    );

    const total = await TinDang.countDocuments(filter);

    res.json({
      success: true,
      data: {
        tinDangs: tinDangWithImages,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error in capNhatTinDang:', error);
    
    // Xử lý các loại lỗi cụ thể
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        error: error.message
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID tin đăng không hợp lệ'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Có lỗi xảy ra'
    });
  }
};

const getTinDangById = async (req, res) => {
  try {
    const tinDang = await TinDang.findById(req.params.id)
      .populate('nguoi_dung_id', 'ho_ten email so_dien_thoai vai_tro trang_thai');

    if (!tinDang) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tin đăng'
      });
    }

    // Lấy avatar của người dùng
    if (tinDang.nguoi_dung_id) {
      const avatar = await Image.findOne({
        nguoi_dung_id: tinDang.nguoi_dung_id._id,
        loai_anh: 'avatar'
      });
      
      if (avatar) {
        tinDang.nguoi_dung_id.avatar = avatar.duong_dan_anh;
      }
    }

    const images = await Image.find({ 
      tin_dang_id: tinDang._id, 
      loai_anh: 'bds' 
    }).sort({ thu_tu: 1 });

    res.json({
      success: true,
      data: {
        ...tinDang.toObject(),
        images: images.map(img => img.duong_dan_anh)
      }
    });
  } catch (error) {
    console.error('Error in capNhatTinDang:', error);
    
    // Xử lý các loại lỗi cụ thể
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        error: error.message
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID tin đăng không hợp lệ'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Có lỗi xảy ra'
    });
  }
};

const capNhatTinDang = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const tinDang = await TinDang.findById(req.params.id);

    if (!tinDang) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tin đăng'
      });
    }

    // Kiểm tra quyền sở hữu
    if (!tinDang.nguoi_dung_id || tinDang.nguoi_dung_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền chỉnh sửa tin đăng này'
      });
    }

    // Kiểm tra trạng thái tin đăng có thể chỉnh sửa
    if (tinDang.trang_thai === 'het_han') {
      return res.status(400).json({
        success: false,
        message: 'Không thể chỉnh sửa tin đăng đã hết hạn'
      });
    }

    // Cập nhật thông tin - chỉ cập nhật các field được phép
    const allowedFields = [
      'tieu_de', 'loai_hinh', 'danh_muc', 'mo_ta', 'gia', 
      'dien_tich', 'dia_chi', 'so_phong_ngu', 'so_phong_tam', 
      'huong_nha', 'trang_thai_phap_ly'
    ];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== '') {
        // Xử lý đặc biệt cho các trường số
        if (['loai_hinh', 'gia', 'dien_tich', 'so_phong_ngu', 'so_phong_tam'].includes(field)) {
          const numValue = Number(req.body[field]);
          if (!isNaN(numValue) && numValue >= 0) {
            tinDang[field] = numValue;
          }
        } else {
          tinDang[field] = req.body[field];
        }
      }
    });

    // Đặt lại trạng thái về chờ duyệt khi chỉnh sửa
    tinDang.trang_thai = 'cho_duyet';

    await tinDang.save();

    // Xử lý xóa ảnh cụ thể
    if (req.body.imagesToDelete) {
      try {
        const imagesToDelete = JSON.parse(req.body.imagesToDelete);
        if (Array.isArray(imagesToDelete) && imagesToDelete.length > 0) {
          // Xóa ảnh từ database
          await Image.deleteMany({ 
            _id: { $in: imagesToDelete },
            tin_dang_id: tinDang._id 
          });
          
          // TODO: Xóa file ảnh từ hệ thống file nếu cần
        }
      } catch (parseError) {
        console.error('Error parsing imagesToDelete:', parseError);
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu ảnh cần xóa không hợp lệ'
        });
      }
    }

    // Xử lý ảnh mới nếu có
    if (req.files && req.files.length > 0) {
      // Lấy số thứ tự cao nhất hiện tại
      const existingImages = await Image.find({ 
        tin_dang_id: tinDang._id, 
        loai_anh: 'bds' 
      }).sort({ thu_tu: -1 }).limit(1);
      
      let startIndex = 0;
      if (existingImages.length > 0) {
        startIndex = existingImages[0].thu_tu + 1;
      }

      // Thêm ảnh mới
      const imagePromises = req.files.map((file, index) => {
        const image = new Image({
          loai_anh: 'bds',
          tin_dang_id: tinDang._id,
          duong_dan_anh: `/assets/tindang/${file.filename}`,
          thu_tu: startIndex + index,
          dung_luong: file.size
        });
        return image.save();
      });

      await Promise.all(imagePromises);
    }

    const updatedTinDang = await TinDang.findById(tinDang._id)
      .populate('nguoi_dung_id', 'ho_ten email');

    res.json({
      success: true,
      message: 'Cập nhật tin đăng thành công',
      data: updatedTinDang
    });
  } catch (error) {
    console.error('Error in capNhatTinDang:', error);
    
    // Xử lý các loại lỗi cụ thể
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        error: error.message
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID tin đăng không hợp lệ'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Có lỗi xảy ra'
    });
  }
};

const xoaTinDang = async (req, res) => {
  try {
    const tinDang = await TinDang.findById(req.params.id);

    if (!tinDang) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tin đăng'
      });
    }

    // Kiểm tra quyền sở hữu
    if (tinDang.nguoi_dung_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa tin đăng này'
      });
    }

    // Xóa ảnh liên quan
    await Image.deleteMany({ tin_dang_id: tinDang._id });

    // Xóa tin đăng
    await TinDang.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Xóa tin đăng thành công'
    });
  } catch (error) {
    console.error('Error in capNhatTinDang:', error);
    
    // Xử lý các loại lỗi cụ thể
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        error: error.message
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID tin đăng không hợp lệ'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Có lỗi xảy ra'
    });
  }
};

module.exports = {
  taoTinDang,
  getDanhSachTinDang,
  getTinDangCuaToi,
  getTinDangById,
  capNhatTinDang,
  xoaTinDang
};