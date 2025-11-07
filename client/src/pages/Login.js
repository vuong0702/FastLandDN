import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    ten_dang_nhap: '',
    mat_khau: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.ten_dang_nhap.trim()) {
      newErrors.ten_dang_nhap = 'Tên đăng nhập không được để trống';
    }
    
    if (!formData.mat_khau) {
      newErrors.mat_khau = 'Mật khẩu không được để trống';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      const result = await login(formData.ten_dang_nhap, formData.mat_khau);
      
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: 'Có lỗi xảy ra, vui lòng thử lại' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Đăng nhập</h2>
          <p>Chào mừng bạn quay trở lại!</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="ten_dang_nhap">Tên đăng nhập</label>
            <input
              type="text"
              id="ten_dang_nhap"
              name="ten_dang_nhap"
              value={formData.ten_dang_nhap}
              onChange={handleChange}
              className={errors.ten_dang_nhap ? 'error' : ''}
              placeholder="Nhập tên đăng nhập"
            />
            {errors.ten_dang_nhap && (
              <span className="field-error">{errors.ten_dang_nhap}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="mat_khau">Mật khẩu</label>
            <input
              type="password"
              id="mat_khau"
              name="mat_khau"
              value={formData.mat_khau}
              onChange={handleChange}
              className={errors.mat_khau ? 'error' : ''}
              placeholder="Nhập mật khẩu"
            />
            {errors.mat_khau && (
              <span className="field-error">{errors.mat_khau}</span>
            )}
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Chưa có tài khoản? 
            <Link to="/register" className="auth-link">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;