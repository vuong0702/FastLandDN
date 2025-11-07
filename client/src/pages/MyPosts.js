import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';
import './MyPosts.css';

const MyPosts = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/my-posts' } } });
    }
  }, [isAuthenticated, navigate]);

  const fetchMyPosts = async (page = 1, status = 'all') => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page,
        limit: 10
      };
      
      if (status !== 'all') {
        params.trang_thai = status;
      }
      
      const response = await axios.get(`${API_URL}/api/tindang/my-posts`, {
        params,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setPosts(response.data.data.tinDangs);
        setCurrentPage(response.data.data.pagination.current_page);
        setTotalPages(response.data.data.pagination.total_pages);
        setTotalPosts(response.data.data.pagination.total_items);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyPosts(currentPage, statusFilter);
    }
  }, [isAuthenticated, currentPage, statusFilter]);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tin đăng này?')) {
      return;
    }
    
    try {
      setDeleteLoading(postId);
      
  const response = await axios.delete(`${API_URL}/api/tindang/${postId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        // Refresh the list
        fetchMyPosts(currentPage, statusFilter);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa tin đăng');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Thỏa thuận';
    return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'cho_duyet': { label: 'Chờ duyệt', class: 'pending' },
      'da_duyet': { label: 'Đã duyệt', class: 'approved' },
      'tu_choi': { label: 'Từ chối', class: 'rejected' },
      'an': { label: 'Đã ẩn', class: 'hidden' }
    };
    
    const statusInfo = statusMap[status] || { label: status, class: 'default' };
    
    return (
      <span className={`status-badge ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        ‹
      </button>
    );

    // First page and ellipsis
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="pagination-btn"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="pagination-ellipsis">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="pagination-ellipsis">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="pagination-btn"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-btn"
      >
        ›
      </button>
    );

    return <div className="pagination">{pages}</div>;
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="my-posts-container">
      <div className="my-posts-wrapper">
        <div className="page-header">
          <div className="header-content">
            <h1>Tin đăng của tôi</h1>
            <p>Quản lý các tin đăng bất động sản của bạn</p>
          </div>
          <Link to="/create-post" className="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Đăng tin mới
          </Link>
        </div>
        
        {/* Filters */}
        <div className="filters">
          <div className="filter-group">
            <label>Trạng thái:</label>
            <div className="filter-buttons">
              <button
                onClick={() => handleStatusFilterChange('all')}
                className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
              >
                Tất cả ({totalPosts})
              </button>
              <button
                onClick={() => handleStatusFilterChange('cho_duyet')}
                className={`filter-btn ${statusFilter === 'cho_duyet' ? 'active' : ''}`}
              >
                Chờ duyệt
              </button>
              <button
                onClick={() => handleStatusFilterChange('da_duyet')}
                className={`filter-btn ${statusFilter === 'da_duyet' ? 'active' : ''}`}
              >
                Đã duyệt
              </button>
              <button
                onClick={() => handleStatusFilterChange('tu_choi')}
                className={`filter-btn ${statusFilter === 'tu_choi' ? 'active' : ''}`}
              >
                Từ chối
              </button>
              <button
                onClick={() => handleStatusFilterChange('an')}
                className={`filter-btn ${statusFilter === 'an' ? 'active' : ''}`}
              >
                Đã ẩn
              </button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="error">
            <p>{error}</p>
            <button onClick={() => fetchMyPosts(currentPage, statusFilter)} className="btn btn-outline">
              Thử lại
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9,22 9,12 15,12 15,22"></polyline>
              </svg>
            </div>
            <h3>Chưa có tin đăng nào</h3>
            <p>Bạn chưa có tin đăng nào. Hãy tạo tin đăng đầu tiên của bạn!</p>
            <Link to="/create-post" className="btn btn-primary">
              Đăng tin ngay
            </Link>
          </div>
        ) : (
          <>
            <div className="posts-grid">
              {posts.map(post => (
                <div key={post._id} className="post-card">
                  <div className="post-image">
                    {post.images && post.images.length > 0 ? (
                      <img 
                        src={`${API_URL}${post.images[0]}`} 
                        alt={post.tieu_de}
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    ) : (
                      <div className="no-image">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21,15 16,10 5,21"></polyline>
                        </svg>
                      </div>
                    )}
                    <div className="post-status">
                      {getStatusBadge(post.trang_thai)}
                    </div>
                  </div>
                  
                  <div className="post-content">
                    <div className="post-header">
                      <h3 className="post-title">
                        <Link to={`/tin-dang/${post._id}`}>
                          {post.tieu_de}
                        </Link>
                      </h3>
                      <div className="post-actions">
                        <Link 
                          to={`/edit-post/${post._id}`} 
                          className="action-btn edit"
                          title="Chỉnh sửa"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </Link>
                        <button 
                          onClick={() => handleDeletePost(post._id)}
                          className="action-btn delete"
                          title="Xóa"
                          disabled={deleteLoading === post._id}
                        >
                          {deleteLoading === post._id ? (
                            <div className="mini-spinner"></div>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3,6 5,6 21,6"></polyline>
                              <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="post-info">
                      <div className="post-price">
                        {formatPrice(post.gia)}
                      </div>
                      <div className="post-location">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {post.dia_chi}
                      </div>
                      <div className="post-meta">
                        <span className="post-date">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12,6 12,12 16,14"></polyline>
                          </svg>
                          {formatDate(post.ngay_tao)}
                        </span>
                        {post.dien_tich && (
                          <span className="post-area">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            </svg>
                            {post.dien_tich}m²
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default MyPosts;