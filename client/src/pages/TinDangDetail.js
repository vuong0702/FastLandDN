import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import './TinDangDetail.css';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const TinDangDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tinDang, setTinDang] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [approvalNote, setApprovalNote] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchTinDang = async () => {
      try {
  const response = await axios.get(`${API_URL}/api/tindang/${id}`);
        
        if (response.data.success) {
          setTinDang(response.data.data);
          
          // Lấy ảnh từ response data (đã được trả về từ API)
          if (response.data.data.images) {
            setImages(response.data.data.images);
          }
          // check saved status
          try {
            const key = `savedPosts_${user?._id || 'guest'}`;
            const stored = localStorage.getItem(key);
            const arr = stored ? JSON.parse(stored) : [];
            setIsSaved(arr.includes(response.data.data._id));
          } catch (e) {
            // ignore
          }
        }
        setLoading(false);
      } catch (err) {
        setError('Không tìm thấy tin đăng hoặc có lỗi xảy ra');
        setLoading(false);
      }
    };

    fetchTinDang();
  }, [id]);

  const formatPrice = (price) => {
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)} tỷ`;
    } else if (price >= 1000000) {
      return `${(price / 1000000).toFixed(0)} triệu`;
    }
    return price.toLocaleString('vi-VN');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleApproval = async (action) => {
    try {
      const response = await axios.put(
  `${API_URL}/api/staff/tin-dang/${id}/duyet`,
        {
          trang_thai: action,
          ghi_chu: approvalNote
        }
      );

      if (response.data.success) {
        setTinDang(prev => ({
          ...prev,
          trang_thai: action,
          ghi_chu: approvalNote
        }));
        setShowApprovalModal(false);
        setApprovalNote('');
        alert(`${action === 'da_duyet' ? 'Duyệt' : 'Từ chối'} tin đăng thành công!`);
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi xử lý tin đăng');
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      let endpoint = '';
      let data = {};
      
      if (action === 'toggle_status') {
  endpoint = `${API_URL}/api/admin/users/${userId}/toggle-status`;
      } else if (action === 'change_role') {
        const newRole = prompt('Nhập vai trò mới (nguoi_dung/nhan_vien/quan_tri):');
        if (!newRole) return;
  endpoint = `${API_URL}/api/admin/users/${userId}/role`;
        data = { vai_tro: newRole };
      }

      const response = await axios.put(endpoint, data);
      
      if (response.data.success) {
        alert('Cập nhật thành công!');
        // Refresh tin đăng để cập nhật thông tin người dùng
        window.location.reload();
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật người dùng');
    }
  };

  const openApprovalModal = (action) => {
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const getSavedKey = () => `savedPosts_${user?._id || 'guest'}`;

  const toggleSave = (postId) => {
    if (!user) {
      // redirect to login if needed
      if (window.confirm('Bạn cần đăng nhập để lưu tin đăng. Chuyển đến trang đăng nhập?')) {
        navigate('/login');
      }
      return;
    }

    try {
      const key = getSavedKey();
      const stored = localStorage.getItem(key);
      const arr = stored ? JSON.parse(stored) : [];

      const exists = arr.includes(postId);
      let newArr;
      if (exists) {
        newArr = arr.filter(i => i !== postId);
      } else {
        newArr = [postId, ...arr];
      }
      localStorage.setItem(key, JSON.stringify(newArr));
      setIsSaved(!exists);
    } catch (e) {
      console.error('Error toggling saved post', e);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'cho_duyet': { text: 'Chờ duyệt', class: 'status-pending' },
      'da_duyet': { text: 'Đã duyệt', class: 'status-approved' },
      'tu_choi': { text: 'Từ chối', class: 'status-rejected' },
      'het_han': { text: 'Hết hạn', class: 'status-expired' }
    };
    
    const statusInfo = statusMap[status] || { text: status, class: 'status-default' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  if (loading) {
    return (
      <div className="detail-container">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  if (error || !tinDang) {
    return (
      <div className="detail-container">
        <div className="error">
          {error}
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <div className="detail-wrapper">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <button onClick={() => navigate('/')} className="breadcrumb-link">
            Trang chủ
          </button>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">Chi tiết tin đăng</span>
        </nav>

        <div className="detail-content">
          {/* Image Gallery */}
          <div className="image-section">
            {images.length > 0 ? (
              <div className="image-gallery">
                <div className="main-image">
                  <img 
                    src={`${API_URL}${images[currentImageIndex]}`}
                    alt={tinDang.tieu_de}
                  />
                  {images.length > 1 && (
                    <>
                      <button className="nav-btn prev-btn" onClick={prevImage}>
                        ‹
                      </button>
                      <button className="nav-btn next-btn" onClick={nextImage}>
                        ›
                      </button>
                    </>
                  )}
                  <div className="image-counter">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </div>
                
                {images.length > 1 && (
                  <div className="thumbnail-list">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img 
                          src={`${API_URL}${image}`}
                          alt={`Ảnh ${index + 1}`}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="no-image-large">
                <svg width="80" height="80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                <span>Không có ảnh</span>
              </div>
            )}
          </div>

          {/* Property Info */}
          <div className="info-section">
            <div className="property-header">
              <div className="property-badge">
                {tinDang.danh_muc === 'ban' ? 'Bán' : 'Cho thuê'}
              </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between'}}>
                  <h1 className="property-title">{tinDang.tieu_de}</h1>
                  <button
                    className={`save-btn ${isSaved ? 'saved' : ''}`}
                    onClick={() => toggleSave(tinDang._id)}
                    aria-label={isSaved ? 'Bỏ lưu tin' : 'Lưu tin'}
                  >
                    {isSaved ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
              <div className="property-price">
                {formatPrice(tinDang.gia)} VNĐ
                {tinDang.dien_tich && (
                  <span className="price-per-m2">
                    ({Math.round(tinDang.gia / tinDang.dien_tich).toLocaleString('vi-VN')} VNĐ/m²)
                  </span>
                )}
              </div>
              <div className="property-location">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {tinDang.dia_chi}
              </div>
            </div>

            {/* Property Details */}
            <div className="property-details">
              <h3>Thông tin chi tiết</h3>
              <div className="details-grid">
                {tinDang.dien_tich && (
                  <div className="detail-item">
                    <span className="detail-label">Diện tích:</span>
                    <span className="detail-value">{tinDang.dien_tich} m²</span>
                  </div>
                )}
                {tinDang.so_phong_ngu && (
                  <div className="detail-item">
                    <span className="detail-label">Phòng ngủ:</span>
                    <span className="detail-value">{tinDang.so_phong_ngu} phòng</span>
                  </div>
                )}
                {tinDang.so_phong_tam && (
                  <div className="detail-item">
                    <span className="detail-label">Phòng tắm:</span>
                    <span className="detail-value">{tinDang.so_phong_tam} phòng</span>
                  </div>
                )}
                {tinDang.huong_nha && (
                  <div className="detail-item">
                    <span className="detail-label">Hướng nhà:</span>
                    <span className="detail-value">{tinDang.huong_nha}</span>
                  </div>
                )}
                {tinDang.trang_thai_phap_ly && (
                  <div className="detail-item">
                    <span className="detail-label">Pháp lý:</span>
                    <span className="detail-value">{tinDang.trang_thai_phap_ly}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">Ngày đăng:</span>
                  <span className="detail-value">{formatDate(tinDang.ngay_tao)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="property-description">
              <h3>Mô tả</h3>
              <div className="description-content">
                {tinDang.mo_ta.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Admin/Staff Management Panel */}
            {user && (user.vai_tro === 'quan_tri' || user.vai_tro === 'nhan_vien') && (
              <div className="admin-panel">
                <h3>Bảng quản trị</h3>
                
                {/* Post Status and Actions */}
                <div className="post-management">
                  <h4>Quản lý tin đăng</h4>
                  <div className="status-info">
                    <p><strong>Trạng thái:</strong> {getStatusBadge(tinDang.trang_thai)}</p>
                    {tinDang.ghi_chu && (
                      <p><strong>Ghi chú:</strong> {tinDang.ghi_chu}</p>
                    )}
                    {tinDang.ngay_het_han && (
                      <p><strong>Ngày hết hạn:</strong> {formatDate(tinDang.ngay_het_han)}</p>
                    )}
                  </div>
                  
                  {tinDang.trang_thai === 'cho_duyet' && (
                    <div className="approval-actions">
                      <button 
                        className="btn btn-success"
                        onClick={() => openApprovalModal('da_duyet')}
                      >
                        Duyệt tin đăng
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => openApprovalModal('tu_choi')}
                      >
                        Từ chối tin đăng
                      </button>
                    </div>
                  )}
                </div>

                {/* User Management (Admin only) */}
                {user.vai_tro === 'quan_tri' && tinDang.nguoi_dung_id && (
                  <div className="user-management">
                    <h4>Quản lý người dùng</h4>
                    <div className="user-info">
                      <p><strong>Tên:</strong> {tinDang.nguoi_dung_id.ho_ten || tinDang.nguoi_dung_id.ten_dang_nhap}</p>
                      <p><strong>Email:</strong> {tinDang.nguoi_dung_id.email}</p>
                      <p><strong>Vai trò:</strong> {tinDang.nguoi_dung_id.vai_tro}</p>
                      <p><strong>Trạng thái:</strong> {tinDang.nguoi_dung_id.trang_thai}</p>
                    </div>
                    <div className="user-actions">
                      <button 
                        className="btn btn-warning"
                        onClick={() => handleUserAction(tinDang.nguoi_dung_id._id, 'toggle_status')}
                      >
                        {tinDang.nguoi_dung_id.trang_thai === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      </button>
                      <button 
                        className="btn btn-info"
                        onClick={() => handleUserAction(tinDang.nguoi_dung_id._id, 'change_role')}
                      >
                        Thay đổi vai trò
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Contact Info */}
            {tinDang.nguoi_dung_id && (
              <div className="contact-section">
                <h3>Thông tin người bán</h3>
                <div className="contact-card">
                  <div className="seller-profile">
                    <div className="seller-avatar">
                      {tinDang.nguoi_dung_id.avatar ? (
                        <img 
                          src={`${API_URL}${tinDang.nguoi_dung_id.avatar}`}
                          alt="Avatar"
                          className="avatar-image"
                        />
                      ) : (
                        <div className="default-avatar">
                          {(tinDang.nguoi_dung_id.ho_ten || tinDang.nguoi_dung_id.ten_dang_nhap).charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="seller-info">
                      <h4 className="seller-name">{tinDang.nguoi_dung_id.ho_ten || tinDang.nguoi_dung_id.ten_dang_nhap}</h4>
                      <div className="seller-badge">
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        Người bán uy tín
                      </div>
                      <div className="contact-details">
                        {tinDang.nguoi_dung_id.email && (
                          <div className="contact-detail">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                            <span>{tinDang.nguoi_dung_id.email}</span>
                          </div>
                        )}
                        {tinDang.nguoi_dung_id.so_dien_thoai && (
                          <div className="contact-detail">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                            </svg>
                            <span>{tinDang.nguoi_dung_id.so_dien_thoai}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="contact-actions">
                    {tinDang.nguoi_dung_id.so_dien_thoai && (
                      <button className="btn btn-primary contact-btn">
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                        </svg>
                        <span>Gọi điện</span>
                      </button>
                    )}
                    {tinDang.nguoi_dung_id.email && (
                      <button className="btn btn-outline contact-btn">
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                        <span>Gửi email</span>
                      </button>
                    )}
                    <button className="btn btn-secondary contact-btn">
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                      </svg>
                      <span>Nhắn tin</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Approval Modal */}
        {showApprovalModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>{approvalAction === 'da_duyet' ? 'Duyệt tin đăng' : 'Từ chối tin đăng'}</h3>
              <div className="modal-body">
                <label htmlFor="approval-note">Ghi chú:</label>
                <textarea
                  id="approval-note"
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  placeholder="Nhập ghi chú (tùy chọn)..."
                  rows="4"
                />
              </div>
              <div className="modal-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowApprovalModal(false)}
                >
                  Hủy
                </button>
                <button 
                  className={`btn ${approvalAction === 'da_duyet' ? 'btn-success' : 'btn-danger'}`}
                  onClick={() => handleApproval(approvalAction)}
                >
                  {approvalAction === 'da_duyet' ? 'Duyệt' : 'Từ chối'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TinDangDetail;