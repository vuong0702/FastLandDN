import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    danh_muc: '',
    gia_min: '',
    gia_max: '',
    dia_chi: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const handleReset = () => {
    setSearchParams({
      danh_muc: '',
      gia_min: '',
      gia_max: '',
      dia_chi: ''
    });
    onSearch({});
  };

  return (
    <div className="search-bar">
      <div className="search-container">
        <h2>Tìm kiếm bất động sản</h2>
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-row">
            <div className="search-field">
              <label htmlFor="danh_muc">Loại giao dịch</label>
              <select
                id="danh_muc"
                name="danh_muc"
                value={searchParams.danh_muc}
                onChange={handleInputChange}
              >
                <option value="">Tất cả</option>
                <option value="ban">Bán</option>
                <option value="cho_thue">Cho thuê</option>
              </select>
            </div>

            <div className="search-field">
              <label htmlFor="dia_chi">Địa chỉ</label>
              <input
                type="text"
                id="dia_chi"
                name="dia_chi"
                placeholder="Nhập địa chỉ..."
                value={searchParams.dia_chi}
                onChange={handleInputChange}
              />
            </div>

            <div className="search-field">
              <label htmlFor="gia_min">Giá từ (VNĐ)</label>
              <input
                type="number"
                id="gia_min"
                name="gia_min"
                placeholder="0"
                value={searchParams.gia_min}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="search-field">
              <label htmlFor="gia_max">Giá đến (VNĐ)</label>
              <input
                type="number"
                id="gia_max"
                name="gia_max"
                placeholder="Không giới hạn"
                value={searchParams.gia_max}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>

          <div className="search-actions">
            <button type="submit" className="btn btn-primary">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              Tìm kiếm
            </button>
            <button type="button" onClick={handleReset} className="btn btn-outline">
              Đặt lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;