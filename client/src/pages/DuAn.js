import React, { useState } from 'react';
import './DuAn.css';

const DuAn = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      name: "Vinhomes Grand Park",
      location: "Quận 9, TP.HCM",
      developer: "Vingroup",
      type: "Căn hộ cao cấp",
      price: "2.5 - 4.2 tỷ VNĐ",
      area: "50 - 120 m²",
      status: "Đang bán",
      completion: "2024",
      image: "https://res.cloudinary.com/brickandbatten/images/f_auto,q_auto/v1660569890/wordpress_assets/GrayBrickHouse-social-share/GrayBrickHouse-social-share.jpg?_i=AA",
      description: "Dự án căn hộ cao cấp với đầy đủ tiện ích hiện đại, giao thông thuận lợi.",
      amenities: ["Hồ bơi", "Gym", "Công viên", "Trường học", "Bệnh viện"],
      priceHistory: [
        { quarter: "Q1/2023", price: 2.2 },
        { quarter: "Q2/2023", price: 2.3 },
        { quarter: "Q3/2023", price: 2.4 },
        { quarter: "Q4/2023", price: 2.5 }
      ]
    },
    {
      id: 2,
      name: "Masteri Thảo Điền",
      location: "Quận 2, TP.HCM",
      developer: "Thảo Điền Investment",
      type: "Căn hộ luxury",
      price: "3.8 - 8.5 tỷ VNĐ",
      area: "65 - 150 m²",
      status: "Sắp mở bán",
      completion: "2025",
      image: "https://pinaywise.com/wp-content/uploads/2024/01/house-in-philippines.jpg",
      description: "Căn hộ cao cấp view sông Sài Gòn, thiết kế hiện đại châu Âu.",
      amenities: ["Sky bar", "Spa", "Tennis", "Marina", "Shopping mall"],
      priceHistory: [
        { quarter: "Q1/2023", price: 3.5 },
        { quarter: "Q2/2023", price: 3.6 },
        { quarter: "Q3/2023", price: 3.7 },
        { quarter: "Q4/2023", price: 3.8 }
      ]
    },
    {
      id: 3,
      name: "Eco Green Saigon",
      location: "Quận 7, TP.HCM",
      developer: "Xuân Mai Corp",
      type: "Căn hộ xanh",
      price: "1.8 - 3.2 tỷ VNĐ",
      area: "45 - 95 m²",
      status: "Đang bán",
      completion: "2024",
      image: "https://cdn.archilovers.com/projects/b_730_9cf4234e-95cb-1dbe-5c98-ef7081d4e887.jpg",
      description: "Dự án căn hộ thân thiện môi trường với công nghệ xanh tiên tiến.",
      amenities: ["Vườn xanh", "Năng lượng mặt trời", "Hệ thống lọc nước", "Khu vui chơi trẻ em"],
      priceHistory: [
        { quarter: "Q1/2023", price: 1.6 },
        { quarter: "Q2/2023", price: 1.7 },
        { quarter: "Q3/2023", price: 1.75 },
        { quarter: "Q4/2023", price: 1.8 }
      ]
    }
  ];

  const marketNews = [
    {
      id: 1,
      title: "Thị trường BĐS TP.HCM tăng trưởng 15% trong Q4/2023",
      date: "15/12/2023",
      summary: "Giá căn hộ tại các quận trung tâm tiếp tục tăng nhẹ, nguồn cung mới tập trung ở khu vực phía Đông.",
      category: "Thị trường"
    },
    {
      id: 2,
      title: "Xu hướng đầu tư BĐS 2024: Tập trung vào căn hộ cao cấp",
      date: "10/12/2023",
      summary: "Các chuyên gia dự báo phân khúc căn hộ cao cấp sẽ là điểm sáng của thị trường trong năm 2024.",
      category: "Đầu tư"
    },
    {
      id: 3,
      title: "Chính sách mới về thuế BĐS có hiệu lực từ 2024",
      date: "05/12/2023",
      summary: "Thuế chuyển nhượng BĐS được điều chỉnh, tạo thuận lợi cho các giao dịch hợp pháp.",
      category: "Chính sách"
    }
  ];

  const marketData = {
    priceIndex: {
      current: 156.8,
      change: "+2.3%",
      period: "So với tháng trước"
    },
    transactions: {
      current: 1247,
      change: "+8.5%",
      period: "Giao dịch tháng 12"
    },
    inventory: {
      current: 15420,
      change: "-3.2%",
      period: "Tồn kho hiện tại"
    },
    avgPrice: {
      current: "45.2 triệu/m²",
      change: "+1.8%",
      period: "Giá trung bình"
    }
  };

  return (
    <div className="du-an-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Dự Án Bất Động Sản</h1>
          <p className="hero-subtitle">
            Khám phá các dự án hot nhất và thông tin thị trường cập nhật
          </p>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              Dự Án Nổi Bật
            </button>
            <button 
              className={`tab ${activeTab === 'market' ? 'active' : ''}`}
              onClick={() => setActiveTab('market')}
            >
              Thị Trường
            </button>
            <button 
              className={`tab ${activeTab === 'news' ? 'active' : ''}`}
              onClick={() => setActiveTab('news')}
            >
              Tin Tức
            </button>
          </div>
        </div>

        {activeTab === 'projects' && (
          <section className="projects-section">
            <div className="projects-grid">
              {projects.map(project => (
                <div key={project.id} className="project-card">
                  <div className="project-image">
                    <img src={project.image} alt={project.name} />
                    <div className="project-status">
                      <span className={`status-badge ${project.status === 'Đang bán' ? 'selling' : 'coming'}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="project-content">
                    <h3>{project.name}</h3>
                    <p className="location">📍 {project.location}</p>
                    <p className="developer">🏢 {project.developer}</p>
                    <div className="project-details">
                      <div className="detail-item">
                        <span className="label">Loại hình:</span>
                        <span className="value">{project.type}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Giá bán:</span>
                        <span className="value price">{project.price}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Diện tích:</span>
                        <span className="value">{project.area}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Hoàn thành:</span>
                        <span className="value">{project.completion}</span>
                      </div>
                    </div>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setSelectedProject(project)}
                    >
                      Xem Chi Tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'market' && (
          <section className="market-section">
            <h2>Thông Tin Thị Trường</h2>
            
            <div className="market-stats">
              <div className="stat-card">
                <h3>Chỉ số giá</h3>
                <div className="stat-number">{marketData.priceIndex.current}</div>
                <div className={`stat-change ${marketData.priceIndex.change.includes('+') ? 'positive' : 'negative'}`}>
                  {marketData.priceIndex.change}
                </div>
                <div className="stat-period">{marketData.priceIndex.period}</div>
              </div>
              
              <div className="stat-card">
                <h3>Giao dịch</h3>
                <div className="stat-number">{marketData.transactions.current}</div>
                <div className={`stat-change ${marketData.transactions.change.includes('+') ? 'positive' : 'negative'}`}>
                  {marketData.transactions.change}
                </div>
                <div className="stat-period">{marketData.transactions.period}</div>
              </div>
              
              <div className="stat-card">
                <h3>Tồn kho</h3>
                <div className="stat-number">{marketData.inventory.current}</div>
                <div className={`stat-change ${marketData.inventory.change.includes('+') ? 'positive' : 'negative'}`}>
                  {marketData.inventory.change}
                </div>
                <div className="stat-period">{marketData.inventory.period}</div>
              </div>
              
              <div className="stat-card">
                <h3>Giá TB</h3>
                <div className="stat-number">{marketData.avgPrice.current}</div>
                <div className={`stat-change ${marketData.avgPrice.change.includes('+') ? 'positive' : 'negative'}`}>
                  {marketData.avgPrice.change}
                </div>
                <div className="stat-period">{marketData.avgPrice.period}</div>
              </div>
            </div>

            <div className="market-analysis">
              <h3>Phân Tích Thị Trường Q4/2023</h3>
              <div className="analysis-content">
                <div className="analysis-item">
                  <h4>🔥 Xu hướng nổi bật</h4>
                  <ul>
                    <li>Căn hộ cao cấp tại khu vực phía Đông TP.HCM tăng giá 3-5%</li>
                    <li>Nhà phố, biệt thự tại các tỉnh lân cận được quan tâm nhiều</li>
                    <li>Bất động sản công nghiệp tiếp tục khan hiếm nguồn cung</li>
                  </ul>
                </div>
                
                <div className="analysis-item">
                  <h4>📊 Dự báo 2024</h4>
                  <ul>
                    <li>Giá BĐS dự kiến tăng 5-8% so với năm 2023</li>
                    <li>Nguồn cung mới tập trung ở phân khúc trung cấp</li>
                    <li>Thị trường cho thuê sẽ phục hồi mạnh mẽ</li>
                  </ul>
                </div>
                
                <div className="analysis-item">
                  <h4>💡 Khuyến nghị đầu tư</h4>
                  <ul>
                    <li>Ưu tiên các dự án có vị trí đắc địa, giao thông thuận lợi</li>
                    <li>Chú ý đến pháp lý và tiến độ xây dựng</li>
                    <li>Đa dạng hóa danh mục đầu tư theo khu vực</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'news' && (
          <section className="news-section">
            <h2>Tin Tức Bất Động Sản</h2>
            <div className="news-grid">
              {marketNews.map(news => (
                <article key={news.id} className="news-card">
                  <div className="news-header">
                    <span className="news-category">{news.category}</span>
                    <span className="news-date">{news.date}</span>
                  </div>
                  <h3 className="news-title">{news.title}</h3>
                  <p className="news-summary">{news.summary}</p>
                  <button className="btn btn-outline">Đọc thêm</button>
                </article>
              ))}
            </div>
            
            <div className="investment-tips">
              <h3>💰 Mẹo Đầu Tư Thông Minh</h3>
              <div className="tips-grid">
                <div className="tip-card">
                  <h4>1. Nghiên cứu kỹ thị trường</h4>
                  <p>Tìm hiểu giá cả, xu hướng và quy hoạch khu vực trước khi đầu tư.</p>
                </div>
                <div className="tip-card">
                  <h4>2. Kiểm tra pháp lý</h4>
                  <p>Đảm bảo dự án có đầy đủ giấy phép và không có tranh chấp.</p>
                </div>
                <div className="tip-card">
                  <h4>3. Đánh giá tiềm năng</h4>
                  <p>Xem xét khả năng tăng giá và thanh khoản trong tương lai.</p>
                </div>
                <div className="tip-card">
                  <h4>4. Quản lý rủi ro</h4>
                  <p>Không đầu tư quá 30% tài sản vào bất động sản.</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedProject.name}</h2>
              <button className="close-btn" onClick={() => setSelectedProject(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="project-detail-grid">
                <div className="project-info">
                  <img src={selectedProject.image} alt={selectedProject.name} />
                  <p className="description">{selectedProject.description}</p>
                  
                  <h4>Tiện ích nổi bật:</h4>
                  <div className="amenities">
                    {selectedProject.amenities.map((amenity, index) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                  </div>
                </div>
                
                <div className="price-chart">
                  <h4>Biến động giá theo quý:</h4>
                  <div className="chart">
                    {selectedProject.priceHistory.map((item, index) => (
                      <div key={index} className="chart-item">
                        <div className="chart-bar" style={{height: `${item.price * 20}px`}}></div>
                        <div className="chart-label">{item.quarter}</div>
                        <div className="chart-value">{item.price}B</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuAn;