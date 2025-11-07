import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import './Profile.css';

const Profile = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    ho_ten: '',
    email: '',
    so_dien_thoai: '',
    dia_chi: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load user data into form
    if (user) {
      setFormData({
        ho_ten: user.ho_ten || '',
        email: user.email || '',
        so_dien_thoai: user.so_dien_thoai || '',
        dia_chi: user.dia_chi || ''
      });
    }
  }, [isAuthenticated, navigate, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Kích thước ảnh không được vượt quá 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file ảnh hợp lệ');
        return;
      }
      
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatar) return;
    
    setUploadingAvatar(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('avatar', avatar);
      
      const token = localStorage.getItem('token');
      const response = await axios.post(
         `${API_URL}/api/users/upload-avatar`,
         formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.success) {
         setMessage('Cập nhật ảnh đại diện thành công!');
         updateUser({ ...user, avatar: response.data.data.duong_dan_anh });
         setAvatar(null);
         setAvatarPreview(null);
       }
    } catch (error) {
      console.error('Avatar upload error:', error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi tải ảnh lên');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
  `${API_URL}/api/users/profile`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setMessage('Cập nhật thông tin thành công!');
        // Update user context with new data
        updateUser(response.data.data);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-section">
            <div className="avatar-container">
              <img 
                src={avatarPreview || (user?.avatar ? `${API_URL}${user.avatar}` : '/default-avatar.svg')} 
                alt="Avatar" 
                className="avatar-image"
              />
              <div className="avatar-overlay" onClick={triggerFileInput}>
                <svg className="camera-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="avatar-input"
              />
            </div>
            {avatar && (
              <button 
                onClick={handleAvatarUpload}
                className="btn btn-upload"
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? 'Đang tải...' : 'Cập nhật ảnh'}
              </button>
            )}
          </div>
          <div className="user-info">
            <h2>{user?.ho_ten || 'Người dùng'}</h2>
            <p className="username">@{user?.ten_dang_nhap}</p>
            <p className="user-role">{user?.vai_tro === 'admin' ? 'Quản trị viên' : user?.vai_tro === 'staff' ? 'Nhân viên' : 'Người dùng'}</p>
          </div>
        </div>

        {message && (
          <div className="alert alert-success">
            <svg className="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {message}
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <svg className="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {error}
          </div>
        )}

        <div className="profile-content">
          <div className="section-title">
            <h3>Thông tin cá nhân</h3>
            <p>Cập nhật thông tin tài khoản của bạn</p>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ten_dang_nhap">
                  <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  id="ten_dang_nhap"
                  value={user?.ten_dang_nhap || ''}
                  disabled
                  className="form-input disabled"
                />
                <small className="form-text">Tên đăng nhập không thể thay đổi</small>
              </div>

              <div className="form-group">
                <label htmlFor="ho_ten">
                  <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Họ và tên *
                </label>
                <input
                  type="text"
                  id="ho_ten"
                  name="ho_ten"
                  value={formData.ho_ten}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  placeholder="Nhập họ và tên"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">
                  <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                  className="form-input disabled"
                />
                <small className="form-text">Email không thể thay đổi</small>
              </div>

              <div className="form-group">
                <label htmlFor="so_dien_thoai">
                  <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="so_dien_thoai"
                  name="so_dien_thoai"
                  value={formData.so_dien_thoai}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="dia_chi">
                <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Địa chỉ
              </label>
              <textarea
                id="dia_chi"
                name="dia_chi"
                value={formData.dia_chi}
                onChange={handleInputChange}
                className="form-input"
                rows="3"
                placeholder="Nhập địa chỉ của bạn"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Cập nhật thông tin
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;