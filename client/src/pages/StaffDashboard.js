import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import './StaffDashboard.css';

const StaffDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tinDangs, setTinDangs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedTinDang, setSelectedTinDang] = useState(null);
  const [approvalNote, setApprovalNote] = useState('');
  const [approvalAction, setApprovalAction] = useState('');

  useEffect(() => {
    if (!user || (user.vai_tro !== 'nhan_vien' && user.vai_tro !== 'quan_tri')) {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate, currentPage, filter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch tin đăng
  const tinDangResponse = await axios.get(`${API_URL}/api/staff/tin-dang`, {
        params: { 
          page: currentPage, 
          limit: 10, 
          trang_thai: filter === 'all' ? '' : filter 
        }
      });
      if (tinDangResponse.data.success) {
        setTinDangs(tinDangResponse.data.data.tinDangs);
      }

      // Fetch statistics
  const statsResponse = await axios.get(`${API_URL}/api/staff/thong-ke`);
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data.tong_quan);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleApproval = async () => {
    if (!selectedTinDang) return;
    
    try {
      const response = await axios.put(
  `${API_URL}/api/staff/tin-dang/${selectedTinDang._id}/duyet`,
        {
          trang_thai: approvalAction,
          ghi_chu: approvalNote
        }
      );

      if (response.data.success) {
        setShowApprovalModal(false);
        setSelectedTinDang(null);
        setApprovalNote('');
        setApprovalAction('');
        fetchData(); // Refresh data
        alert(`${approvalAction === 'da_duyet' ? 'Duyệt' : 'Từ chối'} tin đăng thành công!`);
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi xử lý tin đăng');
    }
  };

  const openApprovalModal = (tinDang, action) => {
    setSelectedTinDang(tinDang);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)} tỷ`;
    } else if (price >= 1000000) {
      return `${(price / 1000000).toFixed(0)} triệu`;
    }
    return price.toLocaleString('vi-VN');
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
      <div className="staff-dashboard">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="staff-dashboard">
      <div className="dashboard-header">
        <h1>Bảng điều khiển Nhân viên</h1>
        <p>Quản lý duyệt tin đăng bất động sản</p>
      </div>

      {/* Statistics */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card pending">
            <h3>Chờ duyệt</h3>
            <div className="stat-number">{stats.cho_duyet || 0}</div>
          </div>
          <div className="stat-card approved">
            <h3>Đã duyệt</h3>
            <div className="stat-number">{stats.da_duyet || 0}</div>
          </div>
          <div className="stat-card rejected">
            <h3>Từ chối</h3>
            <div className="stat-number">{stats.tu_choi || 0}</div>
          </div>
          <div className="stat-card expired">
            <h3>Hết hạn</h3>
            <div className="stat-number">{stats.het_han || 0}</div>
          </div>
        </div>
      </div>

      {/* Filter and Content */}
      <div className="content-section">
        <div className="section-header">
          <h2>Danh sách tin đăng</h2>
          <div className="filters">
            <select 
              value={filter} 
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="cho_duyet">Chờ duyệt</option>
              <option value="da_duyet">Đã duyệt</option>
              <option value="tu_choi">Từ chối</option>
              <option value="het_han">Hết hạn</option>
            </select>
          </div>
        </div>

        <div className="posts-grid">
          {tinDangs.length > 0 ? (
            tinDangs.map(tinDang => (
              <div key={tinDang._id} className="post-card">
                <div className="post-image">
                  {tinDang.images && tinDang.images.length > 0 ? (
                    <img 
                      src={`${API_URL}${tinDang.images[0]}`}
                      alt={tinDang.tieu_de}
                    />
                  ) : (
                    <div className="no-image">
                      <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                      </svg>
                    </div>
                  )}
                  <div className="post-status">
                    {getStatusBadge(tinDang.trang_thai)}
                  </div>
                </div>
                
                <div className="post-content">
                  <h3 className="post-title">{tinDang.tieu_de}</h3>
                  <div className="post-price">
                    {formatPrice(tinDang.gia)} VNĐ
                  </div>
                  <div className="post-info">
                    <p><strong>Người đăng:</strong> {tinDang.nguoi_dung_id?.ho_ten || tinDang.nguoi_dung_id?.ten_dang_nhap}</p>
                    <p><strong>Danh mục:</strong> {tinDang.danh_muc === 'ban' ? 'Bán' : 'Cho thuê'}</p>
                    <p><strong>Địa chỉ:</strong> {tinDang.dia_chi}</p>
                    <p><strong>Ngày tạo:</strong> {formatDate(tinDang.ngay_tao)}</p>
                    {tinDang.ghi_chu && (
                      <p><strong>Ghi chú:</strong> {tinDang.ghi_chu}</p>
                    )}
                  </div>
                  
                  <div className="post-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate(`/tin-dang/${tinDang._id}`)}
                    >
                      Xem chi tiết
                    </button>
                    
                    {tinDang.trang_thai === 'cho_duyet' && (
                      <>
                        <button 
                          className="btn btn-success"
                          onClick={() => openApprovalModal(tinDang, 'da_duyet')}
                        >
                          Duyệt
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => openApprovalModal(tinDang, 'tu_choi')}
                        >
                          Từ chối
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">
              <p>Không có tin đăng nào</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button 
            className="btn btn-outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Trang trước
          </button>
          <span className="page-info">Trang {currentPage}</span>
          <button 
            className="btn btn-outline"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={tinDangs.length < 10}
          >
            Trang sau
          </button>
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedTinDang && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>
              {approvalAction === 'da_duyet' ? 'Duyệt tin đăng' : 'Từ chối tin đăng'}
            </h3>
            <div className="modal-body">
              <div className="post-summary">
                <h4>{selectedTinDang.tieu_de}</h4>
                <p>Người đăng: {selectedTinDang.nguoi_dung_id?.ho_ten || selectedTinDang.nguoi_dung_id?.ten_dang_nhap}</p>
                <p>Giá: {formatPrice(selectedTinDang.gia)} VNĐ</p>
              </div>
              
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
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedTinDang(null);
                  setApprovalNote('');
                }}
              >
                Hủy
              </button>
              <button 
                className={`btn ${approvalAction === 'da_duyet' ? 'btn-success' : 'btn-danger'}`}
                onClick={handleApproval}
              >
                {approvalAction === 'da_duyet' ? 'Duyệt' : 'Từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;