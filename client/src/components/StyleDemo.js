import React, { useState } from 'react';

const StyleDemo = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="text-primary mb-3">Demo Hệ Thống CSS</h1>
        <p className="text-secondary">Minh họa các components và utility classes với màu sắc hài hòa</p>
      </div>

      {/* Alert Demo */}
      {showAlert && (
        <div className="alert alert-success fade-in mb-4">
          <strong>Thành công!</strong> Form đã được gửi thành công.
        </div>
      )}

      <div className="row gap-4">
        {/* Buttons Demo */}
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header">
              <h3 className="card-title">Buttons</h3>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                <button className="btn btn-primary">
                  Primary Button
                </button>
                <button className="btn btn-secondary">
                  Secondary Button
                </button>
                <button className="btn btn-outline">
                  Outline Button
                </button>
                <button className="btn btn-success">
                  Success Button
                </button>
                <button className="btn btn-warning">
                  Warning Button
                </button>
                <button className="btn btn-error">
                  Error Button
                </button>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary btn-sm">
                    Small
                  </button>
                  <button className="btn btn-primary">
                    Normal
                  </button>
                  <button className="btn btn-primary btn-lg">
                    Large
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Demo */}
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header">
              <h3 className="card-title">Form Elements</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Họ và tên</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Nhập họ và tên"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <div className="form-text">Vui lòng nhập họ và tên đầy đủ</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Tin nhắn</label>
                  <textarea
                    name="message"
                    className="form-control"
                    rows="4"
                    placeholder="Nhập tin nhắn của bạn"
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary w-100">
                  Gửi tin nhắn
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Demo */}
      <div className="mt-5">
        <h2 className="text-center mb-4">Property Cards Demo</h2>
        <div className="row gap-4">
          <div className="col-md-4">
            <div className="card shadow hover-lift">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h4 className="card-title">Căn hộ cao cấp</h4>
                  <span className="badge badge-success">Mới</span>
                </div>
                <p className="card-text">
                  Căn hộ 2 phòng ngủ, view sông, đầy đủ nội thất cao cấp tại quận 1.
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-primary font-weight-bold">5.2 tỷ VNĐ</span>
                  <button className="btn btn-outline btn-sm">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card shadow hover-lift">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h4 className="card-title">Nhà phố hiện đại</h4>
                  <span className="badge badge-warning">Hot</span>
                </div>
                <p className="card-text">
                  Nhà phố 3 tầng, thiết kế hiện đại, khu vực an ninh tốt.
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-primary font-weight-bold">8.5 tỷ VNĐ</span>
                  <button className="btn btn-outline btn-sm">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card shadow hover-lift">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h4 className="card-title">Biệt thự vườn</h4>
                  <span className="badge badge-primary">VIP</span>
                </div>
                <p className="card-text">
                  Biệt thự đơn lập có sân vườn rộng, hồ bơi riêng, khu vực yên tĩnh.
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-primary font-weight-bold">15.8 tỷ VNĐ</span>
                  <button className="btn btn-outline btn-sm">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Demo */}
      <div className="mt-5">
        <h2 className="text-center mb-4">Alerts & Notifications</h2>
        <div className="row gap-3">
          <div className="col-12">
            <div className="alert alert-primary">
              <strong>Thông tin:</strong> Đây là thông báo thông tin với màu xanh nhẹ nhàng.
            </div>
          </div>
          <div className="col-12">
            <div className="alert alert-success">
              <strong>Thành công:</strong> Thao tác đã được thực hiện thành công.
            </div>
          </div>
          <div className="col-12">
            <div className="alert alert-warning">
              <strong>Cảnh báo:</strong> Vui lòng kiểm tra lại thông tin trước khi tiếp tục.
            </div>
          </div>
          <div className="col-12">
            <div className="alert alert-error">
              <strong>Lỗi:</strong> Đã xảy ra lỗi, vui lòng thử lại sau.
            </div>
          </div>
        </div>
      </div>

      {/* Loading Demo */}
      <div className="mt-5 text-center">
        <h2 className="mb-4">Loading States</h2>
        <div className="d-flex justify-content-center align-items-center gap-4">
          <div className="d-flex align-items-center gap-2">
            <div className="spinner spinner-sm"></div>
            <span>Small</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="spinner"></div>
            <span>Normal</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="spinner spinner-lg"></div>
            <span>Large</span>
          </div>
        </div>
      </div>

      {/* Typography Demo */}
      <div className="mt-5">
        <h2 className="text-center mb-4">Typography</h2>
        <div className="card shadow">
          <div className="card-body">
            <h1>Heading 1 - Tiêu đề chính</h1>
            <h2>Heading 2 - Tiêu đề phụ</h2>
            <h3>Heading 3 - Tiêu đề mục</h3>
            <h4>Heading 4 - Tiêu đề nhỏ</h4>
            <h5>Heading 5 - Tiêu đề rất nhỏ</h5>
            <h6>Heading 6 - Tiêu đề tối thiểu</h6>
            
            <p className="text-primary">Đây là đoạn văn với màu primary.</p>
            <p className="text-secondary">Đây là đoạn văn với màu secondary.</p>
            <p className="text-tertiary">Đây là đoạn văn với màu tertiary.</p>
            
            <p>
              Đây là một đoạn văn bình thường với <a href="#">liên kết</a> và 
              <code>inline code</code> để minh họa typography.
            </p>
            
            <blockquote>
              "Thiết kế tốt là thiết kế ít nhất có thể." - Dieter Rams
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleDemo;