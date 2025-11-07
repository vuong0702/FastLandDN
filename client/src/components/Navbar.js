import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
// logo image will be used from public folder
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src="/logo-bds.svg" alt="FastLandDN" className="navbar-logo" />
          <h2 className="navbar-title">FastLandDN</h2>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-item"><FaHome />  Trang chủ</Link>
          <Link to="/gioi-thieu" className="navbar-item">Giới thiệu</Link>
          <Link to="/du-an" className="navbar-item">Dự án</Link>
          
          {isAuthenticated ? (
            <div className="user-menu">
              <button 
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span><FaRegUser /> {user?.ho_ten || user?.ten_dang_nhap}</span>
                <svg className="dropdown-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {showUserMenu && (
                <div className="dropdown-menu">
                  {user?.vai_tro === 'quan_tri' && (
                    <Link to="/admin" className="dropdown-item admin-link" onClick={() => setShowUserMenu(false)}>
                      Quản lý bất động sản
                    </Link>
                  )}
                  <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    Thông tin cá nhân
                  </Link>
                  <Link to="/my-posts" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    Tin đăng của tôi
                  </Link>
                  <Link to="/create-post" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    Đăng tin mới
                  </Link>
                  {user?.vai_tro === 'nhan_vien' && (
                    <Link to="/staff" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      Quản lý tin đăng
                    </Link>
                  )}
                  <Link to="/notifications" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    Thông báo
                  </Link>
                  <Link to="/saved-posts" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    Danh sách tin đã lưu
                  </Link>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary">Đăng ký</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;