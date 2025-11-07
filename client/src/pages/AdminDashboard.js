import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [tinDangs, setTinDangs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    vai_tro: '',
    trang_thai: ''
  });
  const [tinDangFilter, setTinDangFilter] = useState('all');

  useEffect(() => {
    if (!user || user.vai_tro !== 'quan_tri') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate, currentPage, tinDangFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics
      const statsResponse = await axios.get(`${API_URL}/api/admin/thong-ke`);
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      // Fetch users
      const usersResponse = await axios.get(`${API_URL}/api/admin/users`, {
        params: { page: currentPage, limit: 10, ...filters }
      });
      if (usersResponse.data.success) {
        setUsers(usersResponse.data.data.users);
      }

      // Fetch tất cả tin đăng
      const tinDangResponse = await axios.get(`${API_URL}/api/staff/tin-dang`, {
        params: { 
          page: currentPage, 
          limit: 10, 
          trang_thai: tinDangFilter === 'all' ? '' : tinDangFilter 
        }
      });
      if (tinDangResponse.data.success) {
        setTinDangs(tinDangResponse.data.data.tinDangs);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action, newValue = null) => {
    try {
      let endpoint = '';
      let data = {};
      
      if (action === 'toggle_status') {
  endpoint = `${API_URL}/api/admin/users/${userId}/toggle-status`;
      } else if (action === 'change_role') {
  endpoint = `${API_URL}/api/admin/users/${userId}/role`;
        data = { vai_tro: newValue };
      }

      const response = await axios.put(endpoint, data);
      
      if (response.data.success) {
        fetchData(); // Refresh data
        alert('Cập nhật thành công!');
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật người dùng');
    }
  };

  const handleRoleChange = (userId, currentRole) => {
    const roles = ['nguoi_dung', 'nhan_vien', 'quan_tri'];
    const newRole = prompt(
      `Chọn vai trò mới:\n1. nguoi_dung\n2. nhan_vien\n3. quan_tri\n\nVai trò hiện tại: ${currentRole}`,
      currentRole
    );
    
    if (newRole && roles.includes(newRole)) {
      handleUserAction(userId, 'change_role', newRole);
    }
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
      'active': { text: 'Hoạt động', class: 'status-active' },
      'lock': { text: 'Bị khóa', class: 'status-locked' },
      'cho_duyet': { text: 'Chờ duyệt', class: 'status-pending' },
      'da_duyet': { text: 'Đã duyệt', class: 'status-approved' },
      'tu_choi': { text: 'Từ chối', class: 'status-rejected' }
    };
    
    const statusInfo = statusMap[status] || { text: status, class: 'status-default' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      'nguoi_dung': { text: 'Người dùng', class: 'role-user' },
      'nhan_vien': { text: 'Nhân viên', class: 'role-staff' },
      'quan_tri': { text: 'Quản trị', class: 'role-admin' }
    };
    
    const roleInfo = roleMap[role] || { text: role, class: 'role-default' };
    return <span className={`role-badge ${roleInfo.class}`}>{roleInfo.text}</span>;
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Bảng điều khiển Admin</h1>
        <p>Quản lý hệ thống bất động sản</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Tổng quan
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Quản lý người dùng
        </button>
        <button 
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Quản lý tin đăng
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Tổng người dùng</h3>
                <div className="stat-number">{stats.tong_quan?.tong_user || 0}</div>
              </div>
              <div className="stat-card">
                <h3>Tổng tin đăng</h3>
                <div className="stat-number">{stats.tong_quan?.tong_tin_dang || 0}</div>
              </div>
              <div className="stat-card">
                <h3>Chờ duyệt</h3>
                <div className="stat-number">{stats.tong_quan?.tin_dang_cho_duyet || 0}</div>
              </div>
              <div className="stat-card">
                <h3>Đã duyệt</h3>
                <div className="stat-number">{stats.tong_quan?.tin_dang_da_duyet || 0}</div>
              </div>
              <div className="stat-card">
                <h3>Từ chối</h3>
                <div className="stat-number">{stats.tong_quan?.tin_dang_tu_choi || 0}</div>
              </div>
              <div className="stat-card">
                <h3>Hết hạn</h3>
                <div className="stat-number">{stats.tong_quan?.tin_dang_het_han || 0}</div>
              </div>
              <div className="stat-card">
                <h3>User bị khóa</h3>
                <div className="stat-number">{stats.tong_quan?.user_bi_khoa || 0}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <div className="section-header">
              <h2>Quản lý người dùng</h2>
              <div className="filters">
                <select 
                  value={filters.vai_tro} 
                  onChange={(e) => setFilters({...filters, vai_tro: e.target.value})}
                >
                  <option value="">Tất cả vai trò</option>
                  <option value="nguoi_dung">Người dùng</option>
                  <option value="nhan_vien">Nhân viên</option>
                  <option value="quan_tri">Quản trị</option>
                </select>
                <select 
                  value={filters.trang_thai} 
                  onChange={(e) => setFilters({...filters, trang_thai: e.target.value})}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="lock">Bị khóa</option>
                </select>
                <button onClick={fetchData} className="btn btn-primary">Lọc</button>
              </div>
            </div>
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tên đăng nhập</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.ten_dang_nhap}</td>
                      <td>{user.ho_ten || '-'}</td>
                      <td>{user.email}</td>
                      <td>{getRoleBadge(user.vai_tro)}</td>
                      <td>{getStatusBadge(user.trang_thai)}</td>
                      <td>{formatDate(user.ngay_tao)}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className={`btn btn-sm ${user.trang_thai === 'active' ? 'btn-warning' : 'btn-success'}`}
                            onClick={() => handleUserAction(user._id, 'toggle_status')}
                          >
                            {user.trang_thai === 'unlock' ?  'Khóa User' : 'Mở Khóa User'}
                          </button>
                          
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tinDangs.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination for posts */}
            <div className="pagination">
              <button 
                className="btn btn-sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              <span className="page-info">
                Trang {currentPage}
              </span>
              <button 
                className="btn btn-sm"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={tinDangs.length < 10}
              >
                Sau
              </button>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="posts-section">
            <div className="section-header">
              <h2>Quản lý tin đăng</h2>
              <div className="filters">
                <select 
                  value={tinDangFilter} 
                  onChange={(e) => {
                    setTinDangFilter(e.target.value);
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
            
            {/* Pagination for posts */}
             <div className="pagination">
               <button 
                 className="btn btn-outline"
                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                 disabled={currentPage === 1}
               >
                 Trang trước
               </button>
               <span className="page-info">
                 Trang {currentPage}
               </span>
               <button 
                 className="btn btn-outline"
                 onClick={() => setCurrentPage(prev => prev + 1)}
                 disabled={tinDangs.length < 10}
               >
                 Trang sau
               </button>
             </div>
           </div>
         )}

       </div>
     </div>
   );
};

export default AdminDashboard;