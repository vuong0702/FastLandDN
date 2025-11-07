import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';
import './CreatePost.css';

const CreatePost = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    tieu_de: '',
    loai_hinh: 1,
    danh_muc: 'ban',
    mo_ta: '',
    gia: '',
    dien_tich: '',
    dia_chi: '',
    so_phong_ngu: '',
    so_phong_tam: '',
    huong_nha: '',
    trang_thai_phap_ly: ''
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/create-post' } } });
    }
  }, [isAuthenticated, navigate]);

  const loaiHinhOptions = [
    { value: 1, label: 'Căn hộ/Chung cư' },
    { value: 2, label: 'Nhà riêng' },
    { value: 3, label: 'Nhà biệt thự, liền kề' },
    { value: 4, label: 'Nhà mặt phố' },
    { value: 5, label: 'Shophouse, nhà phố thương mại' },
    { value: 6, label: 'Đất nền dự án' },
    { value: 7, label: 'Đất thổ cư' },
    { value: 8, label: 'Trang trại, khu nghỉ dưỡng' },
    { value: 9, label: 'Kho, nhà xưởng' },
    { value: 10, label: 'Loại khác' }
  ];

  const handleInputChange = (e) => {
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 10) {
      setErrors(prev => ({
        ...prev,
        images: 'Chỉ được chọn tối đa 10 ảnh'
      }));
      return;
    }
    
    setSelectedImages(files);
    
    // Create previews
    const previews = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(previews).then(setImagePreviews);
    
    // Clear error
    if (errors.images) {
      setErrors(prev => ({
        ...prev,
        images: ''
      }));
    }
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tieu_de.trim()) {
      newErrors.tieu_de = 'Tiêu đề không được để trống';
    } else if (formData.tieu_de.length < 10) {
      newErrors.tieu_de = 'Tiêu đề phải ít nhất 10 ký tự';
    }
    
    if (!formData.mo_ta.trim()) {
      newErrors.mo_ta = 'Mô tả không được để trống';
    } else if (formData.mo_ta.length < 50) {
      newErrors.mo_ta = 'Mô tả phải ít nhất 50 ký tự';
    }
    
    if (!formData.gia || formData.gia <= 0) {
      newErrors.gia = 'Giá phải lớn hơn 0';
    }
    
    if (!formData.dia_chi.trim()) {
      newErrors.dia_chi = 'Địa chỉ không được để trống';
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
      const submitData = new FormData();
      
      // Add form data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Add images
      selectedImages.forEach(image => {
        submitData.append('images', image);
      });
      
  const response = await axios.post(`${API_URL}/api/tindang`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        navigate('/my-posts');
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const fieldErrors = {};
        error.response.data.errors.forEach(err => {
          fieldErrors[err.path] = err.msg;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: error.response?.data?.message || 'Có lỗi xảy ra' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="create-post-container">
      <div className="create-post-wrapper">
        <div className="page-header">
          <h1>Đăng tin bất động sản</h1>
          <p>Tạo tin đăng mới để bán hoặc cho thuê bất động sản của bạn</p>
        </div>
        
        <form onSubmit={handleSubmit} className="create-post-form">
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}
          
          {/* Basic Information */}
          <div className="form-section">
            <h3>Thông tin cơ bản</h3>
            
            <div className="form-group">
              <label htmlFor="tieu_de">Tiêu đề tin đăng *</label>
              <input
                type="text"
                id="tieu_de"
                name="tieu_de"
                value={formData.tieu_de}
                onChange={handleInputChange}
                className={errors.tieu_de ? 'error' : ''}
                placeholder="Nhập tiêu đề hấp dẫn cho tin đăng"
                maxLength={255}
              />
              {errors.tieu_de && (
                <span className="field-error">{errors.tieu_de}</span>
              )}
              <small className="field-hint">
                {formData.tieu_de.length}/255 ký tự
              </small>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="danh_muc">Loại giao dịch *</label>
                <select
                  id="danh_muc"
                  name="danh_muc"
                  value={formData.danh_muc}
                  onChange={handleInputChange}
                >
                  <option value="ban">Bán</option>
                  <option value="cho_thue">Cho thuê</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="loai_hinh">Loại hình bất động sản *</label>
                <select
                  id="loai_hinh"
                  name="loai_hinh"
                  value={formData.loai_hinh}
                  onChange={handleInputChange}
                >
                  {loaiHinhOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="dia_chi">Địa chỉ *</label>
              <input
                type="text"
                id="dia_chi"
                name="dia_chi"
                value={formData.dia_chi}
                onChange={handleInputChange}
                className={errors.dia_chi ? 'error' : ''}
                placeholder="Nhập địa chỉ chi tiết"
              />
              {errors.dia_chi && (
                <span className="field-error">{errors.dia_chi}</span>
              )}
            </div>
          </div>
          
          {/* Price and Details */}
          <div className="form-section">
            <h3>Giá và thông tin chi tiết</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gia">Giá (VNĐ) *</label>
                <input
                  type="number"
                  id="gia"
                  name="gia"
                  value={formData.gia}
                  onChange={handleInputChange}
                  className={errors.gia ? 'error' : ''}
                  placeholder="Nhập giá"
                  min="0"
                />
                {errors.gia && (
                  <span className="field-error">{errors.gia}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="dien_tich">Diện tích (m²)</label>
                <input
                  type="number"
                  id="dien_tich"
                  name="dien_tich"
                  value={formData.dien_tich}
                  onChange={handleInputChange}
                  placeholder="Nhập diện tích"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="so_phong_ngu">Số phòng ngủ</label>
                <input
                  type="number"
                  id="so_phong_ngu"
                  name="so_phong_ngu"
                  value={formData.so_phong_ngu}
                  onChange={handleInputChange}
                  placeholder="Số phòng ngủ"
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="so_phong_tam">Số phòng tắm</label>
                <input
                  type="number"
                  id="so_phong_tam"
                  name="so_phong_tam"
                  value={formData.so_phong_tam}
                  onChange={handleInputChange}
                  placeholder="Số phòng tắm"
                  min="0"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="huong_nha">Hướng nhà</label>
                <select
                  id="huong_nha"
                  name="huong_nha"
                  value={formData.huong_nha}
                  onChange={handleInputChange}
                >
                  <option value="">Chọn hướng nhà</option>
                  <option value="Đông">Đông</option>
                  <option value="Tây">Tây</option>
                  <option value="Nam">Nam</option>
                  <option value="Bắc">Bắc</option>
                  <option value="Đông Nam">Đông Nam</option>
                  <option value="Đông Bắc">Đông Bắc</option>
                  <option value="Tây Nam">Tây Nam</option>
                  <option value="Tây Bắc">Tây Bắc</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="trang_thai_phap_ly">Tình trạng pháp lý</label>
                <input
                  type="text"
                  id="trang_thai_phap_ly"
                  name="trang_thai_phap_ly"
                  value={formData.trang_thai_phap_ly}
                  onChange={handleInputChange}
                  placeholder="VD: Sổ đỏ, Sổ hồng..."
                />
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="form-section">
            <h3>Mô tả chi tiết</h3>
            
            <div className="form-group">
              <label htmlFor="mo_ta">Mô tả *</label>
              <textarea
                id="mo_ta"
                name="mo_ta"
                value={formData.mo_ta}
                onChange={handleInputChange}
                className={errors.mo_ta ? 'error' : ''}
                placeholder="Mô tả chi tiết về bất động sản của bạn..."
                rows={6}
              />
              {errors.mo_ta && (
                <span className="field-error">{errors.mo_ta}</span>
              )}
              <small className="field-hint">
                {formData.mo_ta.length} ký tự (tối thiểu 50 ký tự)
              </small>
            </div>
          </div>
          
          {/* Images */}
          <div className="form-section">
            <h3>Hình ảnh</h3>
            
            <div className="form-group">
              <label htmlFor="images">Chọn ảnh (tối đa 10 ảnh)</label>
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              {errors.images && (
                <span className="field-error">{errors.images}</span>
              )}
              
              {imagePreviews.length > 0 && (
                <div className="image-previews">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="remove-image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Submit */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/my-posts')}
              className="btn btn-outline"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Đang đăng...
                </>
              ) : (
                'Đăng tin'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;