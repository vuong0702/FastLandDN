import React from 'react';
import './GioiThieu.css';

const GioiThieu = () => {
  return (
    <div className="gioi-thieu-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Về FastLandDN</h1>
          <p className="hero-subtitle">
            Tìm đất nhanh – Chọn nhà chuẩn – An tâm cùng FastLandDN
          </p>
        </div>
      </div>

      <div className="content-wrapper">
        <section className="intro-section">
          <div className="container">
            <h2>Chúng tôi là ai?</h2>
            <p>
              FastLandDN là hệ thống bất động sản Đà Nẵng được xây dựng nhằm mang đến cho khách hàng trải
               nghiệm tìm kiếm, mua bán và đầu tư nhà đất nhanh chóng, minh bạch và hiệu quả nhất.
            </p>
            <p>
              Chúng tôi hiểu rằng thời gian là tài sản quý giá – vì thế FastLandDN ra đời với sứ mệnh 
              “Giúp người tìm được đất, giúp đất tìm được người” thông qua công nghệ thông minh và dữ liệu
               chuẩn xác về thị trường Đà Nẵng.
            </p>
          </div>
        </section>

        <section className="services-section">
          <div className="container">
            <h2>Dịch vụ của chúng tôi</h2>
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">🏠</div>
                <h3>Mua bán nhà đất</h3>
                <p>Kết nối trực tiếp người mua và người bán với hàng nghìn tin đăng chất lượng được kiểm duyệt kỹ lưỡng.</p>
              </div>
              <div className="service-card">
                <div className="service-icon">🏢</div>
                <h3>Cho thuê bất động sản</h3>
                <p>Tìm kiếm và đăng tin cho thuê các loại hình bất động sản từ căn hộ, nhà riêng đến văn phòng, mặt bằng.</p>
              </div>
              <div className="service-card">
                <div className="service-icon">📊</div>
                <h3>Tư vấn đầu tư</h3>
                <p>Cung cấp thông tin thị trường, phân tích giá cả và xu hướng để hỗ trợ quyết định đầu tư.</p>
              </div>
              <div className="service-card">
                <div className="service-icon">🔍</div>
                <h3>Thẩm định pháp lý</h3>
                <p>Kiểm tra và xác minh tính pháp lý của bất động sản trước khi giao dịch.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="problems-section">
          <div className="container">
            <h2>Các vấn đề thường gặp khi mua bán bất động sản</h2>
            
            <div className="problem-item">
              <h3>1. Thông tin không minh bạch</h3>
              <div className="problem-content">
                <div className="problem-description">
                  <p><strong>Vấn đề:</strong> Nhiều tin đăng thiếu thông tin chi tiết, hình ảnh không rõ ràng, giá cả không chính xác.</p>
                  <p><strong>Giải pháp của chúng tôi:</strong></p>
                  <ul>
                    <li>Yêu cầu xác minh thông tin người đăng</li>
                    <li>Kiểm duyệt nội dung trước khi đăng tải</li>
                    <li>Hệ thống đánh giá và phản hồi từ người dùng</li>
                  </ul>
                </div>
                <div className="stats-box">
                  <h4>Thống kê</h4>
                  <p>95% tin đăng được xác minh</p>
                  <p>4.8/5 điểm đánh giá độ tin cậy</p>
                </div>
              </div>
            </div>

            <div className="problem-item">
              <h3>2. Rủi ro pháp lý</h3>
              <div className="problem-content">
                <div className="problem-description">
                  <p><strong>Vấn đề:</strong> Tranh chấp về quyền sở hữu, giấy tờ không đầy đủ, vi phạm quy hoạch.</p>
                  <p><strong>Giải pháp của chúng tôi:</strong></p>
                  <ul>
                    <li>Dịch vụ thẩm định pháp lý miễn phí</li>
                    <li>Đội ngũ luật sư chuyên ngành tư vấn</li>
                    <li>Bảo hiểm giao dịch cho các hợp đồng lớn</li>
                  </ul>
                </div>
                <div className="stats-box">
                  <h4>Cam kết</h4>
                  <p>100% giao dịch được thẩm định</p>
                  <p>Bảo hiểm lên đến 1 tỷ VNĐ</p>
                </div>
              </div>
            </div>

            <div className="problem-item">
              <h3>3. Giá cả không hợp lý</h3>
              <div className="problem-content">
                <div className="problem-description">
                  <p><strong>Vấn đề:</strong> Giá đăng cao hơn thị trường, thiếu thông tin so sánh giá khu vực.</p>
                  <p><strong>Giải pháp của chúng tôi:</strong></p>
                  <ul>
                    <li>Công cụ định giá tự động dựa trên AI</li>
                    <li>Báo cáo giá thị trường theo khu vực</li>
                    <li>Lịch sử biến động giá chi tiết</li>
                  </ul>
                </div>
                <div className="stats-box">
                  <h4>Độ chính xác</h4>
                  <p>92% giá đăng sát thị trường</p>
                  <p>Cập nhật giá hàng tuần</p>
                </div>
              </div>
            </div>

            <div className="problem-item">
              <h3>4. Khó khăn trong thương lượng</h3>
              <div className="problem-content">
                <div className="problem-description">
                  <p><strong>Vấn đề:</strong> Thiếu kỹ năng đàm phán, không hiểu rõ quy trình giao dịch.</p>
                  <p><strong>Giải pháp của chúng tôi:</strong></p>
                  <ul>
                    <li>Hỗ trợ môi giới chuyên nghiệp</li>
                    <li>Hướng dẫn quy trình giao dịch chi tiết</li>
                    <li>Dịch vụ đàm phán thay mặt</li>
                  </ul>
                </div>
                <div className="stats-box">
                  <h4>Hiệu quả</h4>
                  <p>85% giao dịch thành công</p>
                  <p>Tiết kiệm 15% chi phí trung bình</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="why-choose-us">
          <div className="container">
            <h2>Tại sao chọn FastLandDN?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <h3>🛡️ An toàn & Bảo mật</h3>
                <p>Hệ thống bảo mật đa lớp, mã hóa thông tin cá nhân và giao dịch.</p>
              </div>
              <div className="feature-item">
                <h3>⚡ Nhanh chóng & Hiệu quả</h3>
                <p>Tìm kiếm thông minh, kết nối trực tiếp, xử lý giao dịch nhanh chóng.</p>
              </div>
              <div className="feature-item">
                <h3>💰 Minh bạch chi phí</h3>
                <p>Không phí ẩn, mức phí cạnh tranh, nhiều gói dịch vụ linh hoạt.</p>
              </div>
              <div className="feature-item">
                <h3>🎯 Chính xác cao</h3>
                <p>AI hỗ trợ định giá, phân tích thị trường chính xác và cập nhật.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section">
          <div className="container">
            <h2>Liên hệ với chúng tôi</h2>
            <div className="contact-info">
              <div className="contact-item">
                <h3>📞 Hotline</h3>
                <p>1900 1234 (24/7)</p>
              </div>
              <div className="contact-item">
                <h3>📧 Email</h3>
                <p>support@batdongsanviet.com</p>
              </div>
              <div className="contact-item">
                <h3>🏢 Văn phòng</h3>
                <p>123 Nguyễn Huệ, Quận 1, TP.HCM</p>
              </div>
              <div className="contact-item">
                <h3>⏰ Giờ làm việc</h3>
                <p>T2-T6: 8:00-18:00<br/>T7-CN: 8:00-17:00</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GioiThieu;