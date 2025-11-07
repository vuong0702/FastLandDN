require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const TinDang = require('../models/TinDang');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate';

const tinDangMau = [
  {
    tieu_de: 'Căn hộ cao cấp Vinhomes Central Park',
    mo_ta: 'Căn hộ 3 phòng ngủ view sông tuyệt đẹp, full nội thất cao cấp, an ninh 24/7, tiện ích đầy đủ: hồ bơi, gym, spa,...',
    gia: 5800000000,
    dien_tich: 98,
    dia_chi: '208 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh, TP.HCM',
    so_phong_ngu: 3,
    so_phong_tam: 2,
    huong_nha: 'Đông Nam',
    loai_hinh: 1, // Căn hộ/Chung cư
    danh_muc: 'ban',
    trang_thai_phap_ly: 'Sổ hồng',
    images: ['/assets/tindang/sample1.jpg', '/assets/tindang/sample2.jpg']
  },
  {
    tieu_de: 'Biệt thự nghỉ dưỡng Đà Lạt',
    mo_ta: 'Biệt thự view đồi thông, thiết kế hiện đại, sân vườn rộng rãi, không gian yên tĩnh phù hợp nghỉ dưỡng.',
    gia: 12500000000,
    dien_tich: 300,
    dia_chi: '123 Đường Trần Hưng Đạo, Phường 10, Đà Lạt, Lâm Đồng',
    so_phong_ngu: 4,
    so_phong_tam: 4,
    huong_nha: 'Đông Bắc',
    loai_hinh: 3, // Biệt thự
    danh_muc: 'ban',
    trang_thai_phap_ly: 'Sổ đỏ',
    images: ['/assets/tindang/sample3.jpg', '/assets/tindang/sample4.jpg']
  },
  {
    tieu_de: 'Nhà phố thương mại Phú Mỹ Hưng',
    mo_ta: 'Shophouse mặt tiền đường lớn, vị trí đắc địa kinh doanh, thiết kế 1 trệt 3 lầu hiện đại.',
    gia: 28000000000,
    dien_tich: 200,
    dia_chi: '15 Nguyễn Lương Bằng, Phú Mỹ Hưng, Quận 7, TP.HCM',
    so_phong_ngu: 5,
    so_phong_tam: 6,
    huong_nha: 'Đông',
    loai_hinh: 5, // Shophouse
    danh_muc: 'ban',
    trang_thai_phap_ly: 'Sổ hồng',
    images: ['/assets/tindang/sample5.jpg', '/assets/tindang/sample6.jpg']
  },
  {
    tieu_de: 'Căn hộ cho thuê Masteri Thảo Điền',
    mo_ta: '2 phòng ngủ đầy đủ nội thất cao cấp, view sông và landmark 81, gần trường quốc tế BIS.',
    gia: 20000000, // giá thuê/tháng
    dien_tich: 75,
    dia_chi: '159 Xa lộ Hà Nội, Thảo Điền, Quận 2, TP.HCM',
    so_phong_ngu: 2,
    so_phong_tam: 2,
    huong_nha: 'Nam',
    loai_hinh: 1, // Căn hộ
    danh_muc: 'cho_thue',
    trang_thai_phap_ly: 'Sổ hồng',
    images: ['/assets/tindang/sample7.jpg', '/assets/tindang/sample8.jpg']
  }
];

async function createSampleData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Kết nối MongoDB thành công');

    // Tìm admin user để gán làm người đăng tin
    const admin = await User.findOne({ ten_dang_nhap: 'admin' });
    if (!admin) {
      throw new Error('Không tìm thấy tài khoản admin');
    }

    // Tạo tin đăng mẫu
    for (const tinDang of tinDangMau) {
      const newTinDang = new TinDang({
        ...tinDang,
        nguoi_dung_id: admin._id,
        trang_thai: 'da_duyet', // Tin đã được duyệt
        thoi_gian_dang: new Date(),
        thoi_gian_duyet: new Date()
      });

      await newTinDang.save();
      console.log('Đã tạo tin đăng:', tinDang.tieu_de);
    }

    console.log('Hoàn thành tạo dữ liệu mẫu');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Lỗi:', error);
    process.exit(1);
  }
}

createSampleData();