import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    ten_dang_nhap: '',
    mat_khau: '',
    xac_nhan_mat_khau: '',
    email: '',
    ho_ten: '',
    so_dien_thoai: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

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
    } else if (formData.ten_dang_nhap.length < 3) {
      newErrors.ten_dang_nhap = 'Tên đăng nhập phải ít nhất 3 ký tự';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.mat_khau) {
      newErrors.mat_khau = 'Mật khẩu không được để trống';
    } else if (formData.mat_khau.length < 6) {
      newErrors.mat_khau = 'Mật khẩu phải ít nhất 6 ký tự';
    }
    
    if (!formData.xac_nhan_mat_khau) {
      newErrors.xac_nhan_mat_khau = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.mat_khau !== formData.xac_nhan_mat_khau) {
      newErrors.xac_nhan_mat_khau = 'Mật khẩu xác nhận không khớp';
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
      const { xac_nhan_mat_khau, ...registerData } = formData;
      const result = await register(registerData);
      
      if (result.success) {
        navigate('/');
      } else {
        if (result.errors) {
          const fieldErrors = {};
          result.errors.forEach(error => {
            fieldErrors[error.path] = error.msg;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: result.message });
        }
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
          <h2>Đăng ký</h2>
          <p>Tạo tài khoản mới để bắt đầu</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ten_dang_nhap">Tên đăng nhập *</label>
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
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="Nhập email"
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="ho_ten">Họ và tên</label>
            <input
              type="text"
              id="ho_ten"
              name="ho_ten"
              value={formData.ho_ten}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="so_dien_thoai">Số điện thoại</label>
            <input
              type="tel"
              id="so_dien_thoai"
              name="so_dien_thoai"
              value={formData.so_dien_thoai}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mat_khau">Mật khẩu *</label>
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
            
            <div className="form-group">
              <label htmlFor="xac_nhan_mat_khau">Xác nhận mật khẩu *</label>
              <input
                type="password"
                id="xac_nhan_mat_khau"
                name="xac_nhan_mat_khau"
                value={formData.xac_nhan_mat_khau}
                onChange={handleChange}
                className={errors.xac_nhan_mat_khau ? 'error' : ''}
                placeholder="Nhập lại mật khẩu"
              />
              {errors.xac_nhan_mat_khau && (
                <span className="field-error">{errors.xac_nhan_mat_khau}</span>
              )}
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Đang đăng ký...
              </>
            ) : (
              'Đăng ký'
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Đã có tài khoản? 
            <Link to="/login" className="auth-link">Đăng nhập ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;