import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';
import './EditPost.css'; // Sử dụng chung CSS với CreatePost

const EditPost = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
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
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/edit-post/${id}` } } });
    }
  }, [isAuthenticated, navigate, id]);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
  const response = await axios.get(`${API_URL}/api/tindang/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data.success) {
          const post = response.data.data;
          
          // Check if user owns this post
          const postOwnerId = typeof post.nguoi_dung_id === 'object' ? post.nguoi_dung_id._id : post.nguoi_dung_id;
          if (postOwnerId !== user._id) {
            navigate('/my-posts');
            return;
          }
          
          setFormData({
            tieu_de: post.tieu_de || '',
            loai_hinh: post.loai_hinh || 1,
            danh_muc: post.danh_muc || 'ban',
            mo_ta: post.mo_ta || '',
            gia: post.gia || '',
            dien_tich: post.dien_tich || '',
            dia_chi: post.dia_chi || '',
            so_phong_ngu: post.so_phong_ngu || '',
            so_phong_tam: post.so_phong_tam || '',
            huong_nha: post.huong_nha || '',
            trang_thai_phap_ly: post.trang_thai_phap_ly || ''
          });
          
          // Fetch images
          try {
            const imageResponse = await axios.get(`${API_URL}/api/images/tindang/${id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            if (imageResponse.data.success) {
              setExistingImages(imageResponse.data.data || []);
            }
          } catch (imageError) {
            console.error('Error fetching images:', imageError);
            // Không cần redirect, chỉ log lỗi và để mảng ảnh rỗng
            setExistingImages([]);
          }
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        navigate('/my-posts');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && id) {
      fetchPost();
    }
  }, [isAuthenticated, id, user, navigate]);

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
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });
    
    if (validFiles.length !== files.length) {
      alert('Một số file không hợp lệ. Chỉ chấp nhận file ảnh dưới 5MB.');
    }
    
    setNewImages(validFiles);
  };

  const handleDeleteExistingImage = (imageId) => {
    setImagesToDelete(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(img => img._id !== imageId));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tieu_de || formData.tieu_de.trim().length < 10) {
      newErrors.tieu_de = 'Tiêu đề phải có ít nhất 10 ký tự';
    }
    
    if (!formData.mo_ta || formData.mo_ta.trim().length < 50) {
      newErrors.mo_ta = 'Mô tả phải có ít nhất 50 ký tự';
    }
    
    if (!formData.gia || Number(formData.gia) <= 0) {
      newErrors.gia = 'Giá phải lớn hơn 0';
    }
    
    if (!formData.dia_chi || formData.dia_chi.trim().length === 0) {
      newErrors.dia_chi = 'Địa chỉ không được để trống';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setErrors({});
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Add form fields - chỉ thêm các field có giá trị hợp lệ
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (value !== '' && value !== null && value !== undefined) {
          // Đối với các trường số, đảm bảo chúng là số hợp lệ
          if (['loai_hinh', 'gia', 'dien_tich', 'so_phong_ngu', 'so_phong_tam'].includes(key)) {
            const numValue = Number(value);
            if (!isNaN(numValue) && numValue >= 0) {
              formDataToSend.append(key, numValue);
            }
          } else {
            formDataToSend.append(key, value);
          }
        }
      });
      
      // Add new images
      newImages.forEach(image => {
        formDataToSend.append('images', image);
      });
      
      // Add images to delete
      if (imagesToDelete.length > 0) {
        formDataToSend.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }

      const response = await axios.put(
  `${API_URL}/api/tindang/${id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        navigate('/my-posts', { 
          state: { message: 'Cập nhật tin đăng thành công!' }
        });
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const errorObj = {};
        error.response.data.errors.forEach(err => {
          errorObj[err.path] = err.msg;
        });
        setErrors(errorObj);
      } else {
        setErrors({ general: error.response?.data?.message || 'Có lỗi xảy ra' });
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="create-post-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-post-container">
      <div className="create-post-wrapper">
        <div className="page-header">
          <h1>Chỉnh sửa tin đăng</h1>
          <p>Cập nhật thông tin bất động sản của bạn</p>
        </div>

        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-post-form">
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
                placeholder="Nhập tiêu đề tin đăng"
                required
              />
              {errors.tieu_de && <span className="error-text">{errors.tieu_de}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="loai_hinh">Loại hình *</label>
                <select
                  id="loai_hinh"
                  name="loai_hinh"
                  value={formData.loai_hinh}
                  onChange={handleInputChange}
                  className={errors.loai_hinh ? 'error' : ''}
                  required
                >
                  <option value={1}>Nhà ở</option>
                  <option value={2}>Chung cư</option>
                  <option value={3}>Đất nền</option>
                  <option value={4}>Biệt thự</option>
                  <option value={5}>Nhà phố</option>
                </select>
                {errors.loai_hinh && <span className="error-text">{errors.loai_hinh}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="danh_muc">Danh mục *</label>
                <select
                  id="danh_muc"
                  name="danh_muc"
                  value={formData.danh_muc}
                  onChange={handleInputChange}
                  className={errors.danh_muc ? 'error' : ''}
                  required
                >
                  <option value="ban">Bán</option>
                  <option value="cho_thue">Cho thuê</option>
                </select>
                {errors.danh_muc && <span className="error-text">{errors.danh_muc}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="mo_ta">Mô tả *</label>
              <textarea
                id="mo_ta"
                name="mo_ta"
                value={formData.mo_ta}
                onChange={handleInputChange}
                className={errors.mo_ta ? 'error' : ''}
                placeholder="Mô tả chi tiết về bất động sản"
                rows={6}
                required
              />
              {errors.mo_ta && <span className="error-text">{errors.mo_ta}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3>Thông tin chi tiết</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gia">Giá *</label>
                <input
                  type="number"
                  id="gia"
                  name="gia"
                  value={formData.gia}
                  onChange={handleInputChange}
                  className={errors.gia ? 'error' : ''}
                  placeholder="Nhập giá (VNĐ)"
                  min="0"
                  required
                />
                {errors.gia && <span className="error-text">{errors.gia}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="dien_tich">Diện tích (m²)</label>
                <input
                  type="number"
                  id="dien_tich"
                  name="dien_tich"
                  value={formData.dien_tich}
                  onChange={handleInputChange}
                  className={errors.dien_tich ? 'error' : ''}
                  placeholder="Nhập diện tích"
                  min="0"
                  step="0.1"
                />
                {errors.dien_tich && <span className="error-text">{errors.dien_tich}</span>}
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
                required
              />
              {errors.dia_chi && <span className="error-text">{errors.dia_chi}</span>}
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
                  className={errors.so_phong_ngu ? 'error' : ''}
                  placeholder="Số phòng ngủ"
                  min="0"
                />
                {errors.so_phong_ngu && <span className="error-text">{errors.so_phong_ngu}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="so_phong_tam">Số phòng tắm</label>
                <input
                  type="number"
                  id="so_phong_tam"
                  name="so_phong_tam"
                  value={formData.so_phong_tam}
                  onChange={handleInputChange}
                  className={errors.so_phong_tam ? 'error' : ''}
                  placeholder="Số phòng tắm"
                  min="0"
                />
                {errors.so_phong_tam && <span className="error-text">{errors.so_phong_tam}</span>}
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
                  className={errors.huong_nha ? 'error' : ''}
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
                {errors.huong_nha && <span className="error-text">{errors.huong_nha}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="trang_thai_phap_ly">Trạng thái pháp lý</label>
                <input
                  type="text"
                  id="trang_thai_phap_ly"
                  name="trang_thai_phap_ly"
                  value={formData.trang_thai_phap_ly}
                  onChange={handleInputChange}
                  className={errors.trang_thai_phap_ly ? 'error' : ''}
                  placeholder="Ví dụ: Sổ đỏ, Sổ hồng..."
                />
                {errors.trang_thai_phap_ly && <span className="error-text">{errors.trang_thai_phap_ly}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Hình ảnh</h3>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="existing-images">
                <h4>Hình ảnh hiện tại:</h4>
                <div className="image-grid">
                  {existingImages.map(image => (
                    <div key={image._id} className="image-item">
                      <img 
                        src={`${API_URL}${image.duong_dan_anh}`} 
                        alt="Existing" 
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(image._id)}
                        className="delete-image-btn"
                        title="Xóa ảnh"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* New Images */}
            <div className="form-group">
              <label htmlFor="images">Thêm hình ảnh mới</label>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className={errors.images ? 'error' : ''}
              />
              <small className="form-help">Chọn tối đa 10 ảnh, mỗi ảnh dưới 5MB</small>
              {errors.images && <span className="error-text">{errors.images}</span>}
            </div>
            
            {newImages.length > 0 && (
              <div className="image-preview">
                <h4>Ảnh mới sẽ thêm:</h4>
                <div className="image-grid">
                  {newImages.map((image, index) => (
                    <div key={index} className="image-item">
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Preview ${index}`} 
                      />
                      <button
                        type="button"
                        onClick={() => setNewImages(prev => prev.filter((_, i) => i !== index))}
                        className="delete-image-btn"
                        title="Xóa ảnh"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/my-posts')}
              className="btn btn-outline"
              disabled={submitLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitLoading}
            >
              {submitLoading ? (
                <>
                  <div className="spinner small"></div>
                  Đang cập nhật...
                </>
              ) : (
                'Cập nhật tin đăng'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;