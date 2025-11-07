
const TinDang = require('../models/TinDang');
const Image = require('../models/Image');

const getDanhSachTinDangChoDuyet = async (req, res) => {
  try {
    const { page = 1, limit = 10, trang_thai } = req.query;
    
    const filter = {};
    if (trang_thai) {
      filter.trang_thai = trang_thai;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tinDangs = await TinDang.find(filter)
      .populate('nguoi_dung_id', 'ho_ten email so_dien_thoai')
      .sort({ ngay_tao: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Lấy ảnh cho mỗi tin đăng
    const tinDangWithImages = await Promise.all(
      tinDangs.map(async (tinDang) => {
        const images = await Image.find({ 
          tin_dang_id: tinDang._id, 
          loai_anh: 'bds' 
        }).sort({ thu_tu: 1 });
        
        return {
          ...tinDang.toObject(),
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
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

const duyetTinDang = async (req, res) => {
  try {
    const { tinDangId } = req.params;
    const { trang_thai, ghi_chu } = req.body;

    if (!['da_duyet', 'tu_choi'].includes(trang_thai)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }

    const tinDang = await TinDang.findById(tinDangId);

    if (!tinDang) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tin đăng'
      });
    }

    tinDang.trang_thai = trang_thai;
    if (ghi_chu) tinDang.ghi_chu = ghi_chu;

    // Nếu duyệt thành công, set ngày hết hạn (30 ngày từ ngày duyệt)
    if (trang_thai === 'da_duyet') {
      const ngayHetHan = new Date();
      ngayHetHan.setDate(ngayHetHan.getDate() + 30);
      tinDang.ngay_het_han = ngayHetHan;
    }

    await tinDang.save();

    const updatedTinDang = await TinDang.findById(tinDangId)
      .populate('nguoi_dung_id', 'ho_ten email');

    res.json({
      success: true,
      message: `${trang_thai === 'da_duyet' ? 'Duyệt' : 'Từ chối'} tin đăng thành công`,
      data: updatedTinDang
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

const getThongKeDuyet = async (req, res) => {
  try {
    const choDuyet = await TinDang.countDocuments({ trang_thai: 'cho_duyet' });
    const daDuyet = await TinDang.countDocuments({ trang_thai: 'da_duyet' });
    const tuChoi = await TinDang.countDocuments({ trang_thai: 'tu_choi' });
    const hetHan = await TinDang.countDocuments({ trang_thai: 'het_han' });

    // Thống kê tin đăng được duyệt theo ngày trong tuần qua
    const motTuanTruoc = new Date();
    motTuanTruoc.setDate(motTuanTruoc.getDate() - 7);

    const thongKeTheoNgay = await TinDang.aggregate([
      {
        $match: {
          trang_thai: 'da_duyet',
          ngay_cap_nhat: { $gte: motTuanTruoc }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$ngay_cap_nhat' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        tong_quan: {
          cho_duyet: choDuyet,
          da_duyet: daDuyet,
          tu_choi: tuChoi,
          het_han: hetHan
        },
        thong_ke_theo_ngay: thongKeTheoNgay
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
  getDanhSachTinDangChoDuyet,
  duyetTinDang,
  getThongKeDuyet
};