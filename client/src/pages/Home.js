import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../components/Searchbar';
import { API_URL } from '../config';
import './Home.css';

const Home = () => {
  const [tinDangList, setTinDangList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState({});

  const fetchTinDang = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...filters
      });
      
      const response = await axios.get(`${API_URL}/api/tindang?${params}`);
      
      if (response.data.success) {
        setTinDangList(response.data.data.tinDangs);
        setPagination(response.data.data.pagination);
      }
      setLoading(false);
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTinDang(currentPage, searchParams);
  }, [currentPage, searchParams]);

  const handleSearch = (filters) => {
    setSearchParams(filters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatPrice = (price) => {
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)} tỷ`;
    } else if (price >= 1000000) {
      return `${(price / 1000000).toFixed(0)} triệu`;
    }
    return price.toLocaleString('vi-VN');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading && tinDangList.length === 0) {
    return (
      <div className="home-container">
        <SearchBar onSearch={handleSearch} />
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <SearchBar onSearch={handleSearch} />
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <SearchBar onSearch={handleSearch} />
      
      <div className="content-wrapper">
        <div className="results-header">
          <h1>Danh sách bất động sản</h1>
          {pagination.total && (
            <p className="results-count">
              Tìm thấy {pagination.total} kết quả
            </p>
          )}
        </div>
        
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <>
            <div className="tin-dang-grid">
              {tinDangList.map((tinDang) => (
                <div key={tinDang._id} className="tin-dang-card">
                  <div className="card-image">
                    {tinDang.images && tinDang.images[0] ? (
                      <img 
                        src={`${API_URL}${tinDang.images[0]}`}
                        alt={tinDang.tieu_de}
                        className="tin-dang-image"
                      />
                    ) : (
                      <div className="no-image">
                        <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                        <span>Không có ảnh</span>
                      </div>
                    )}
                    <div className="card-badge">
                      {tinDang.danh_muc === 'ban' ? 'Bán' : 'Cho thuê'}
                    </div>
                  </div>
                  
                  <div className="tin-dang-content">
                    <h3 className="card-title">{tinDang.tieu_de}</h3>
                    <p className="card-price">
                      {formatPrice(tinDang.gia)} VNĐ
                      {tinDang.dien_tich && (
                        <span className="area"> • {tinDang.dien_tich}m²</span>
                      )}
                    </p>
                    <p className="card-location">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      {tinDang.dia_chi}
                    </p>
                    <p className="card-description">
                      {tinDang.mo_ta.length > 120 
                        ? `${tinDang.mo_ta.substring(0, 120)}...` 
                        : tinDang.mo_ta
                      }
                    </p>
                    
                    <div className="card-footer">
                      <div className="card-meta">
                        <span className="date">{formatDate(tinDang.ngay_tao)}</span>
                        {tinDang.nguoi_dung_id?.ho_ten && (
                          <span className="author">bởi {tinDang.nguoi_dung_id.ho_ten}</span>
                        )}
                      </div>
                      <Link 
                        to={`/tin-dang/${tinDang._id}`} 
                        className="btn btn-primary btn-sm"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
        ))}
             </div>
             
             {/* Pagination */}
             {pagination.total_pages > 1 && (
               <div className="pagination">
                 <button 
                   onClick={() => handlePageChange(currentPage - 1)}
                   disabled={currentPage === 1}
                   className="pagination-btn"
                 >
                   ‹ Trước
                 </button>
                 
                 {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                   .filter(page => {
                     const distance = Math.abs(page - currentPage);
                     return distance <= 2 || page === 1 || page === pagination.total_pages;
                   })
                   .map((page, index, array) => {
                     const prevPage = array[index - 1];
                     const showEllipsis = prevPage && page - prevPage > 1;
                     
                     return (
                       <React.Fragment key={page}>
                         {showEllipsis && <span className="pagination-ellipsis">...</span>}
                         <button
                           onClick={() => handlePageChange(page)}
                           className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                         >
                           {page}
                         </button>
                       </React.Fragment>
                     );
                   })
                 }
                 
                 <button 
                   onClick={() => handlePageChange(currentPage + 1)}
                   disabled={currentPage === pagination.total_pages}
                   className="pagination-btn"
                 >
                   Sau ›
                 </button>
               </div>
             )}
           </>
         )}
       </div>
     </div>
   );
 };

export default Home;