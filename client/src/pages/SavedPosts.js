import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import './SavedPosts.css';

const SavedPosts = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/saved-posts' } } });
      return;
    }

    const fetchSaved = async () => {
      setLoading(true);
      try {
        const key = `savedPosts_${user?._id || 'guest'}`;
        const stored = localStorage.getItem(key);
        const arr = stored ? JSON.parse(stored) : [];

        if (!arr || arr.length === 0) {
          setPosts([]);
          setLoading(false);
          return;
        }

        const requests = arr.map(id => axios.get(`${API_URL}/api/tindang/${id}`));
        const results = await Promise.allSettled(requests);
        const fetched = results
          .filter(r => r.status === 'fulfilled' && r.value.data && r.value.data.success)
          .map(r => r.value.data.data);

        setPosts(fetched);
      } catch (e) {
        console.error('Error fetching saved posts', e);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [isAuthenticated, user, navigate]);

  const removeSaved = (postId) => {
    const key = `savedPosts_${user?._id || 'guest'}`;
    const stored = localStorage.getItem(key);
    const arr = stored ? JSON.parse(stored) : [];
    const newArr = arr.filter(i => i !== postId);
    localStorage.setItem(key, JSON.stringify(newArr));
    setPosts(prev => prev.filter(p => p._id !== postId));
  };

  const formatPrice = (price) => {
    if (!price) return 'Thỏa thuận';
    if (price >= 1000000000) return `${(price / 1000000000).toFixed(1)} tỷ VNĐ`;
    if (price >= 1000000) return `${(price / 1000000).toFixed(0)} triệu VNĐ`;
    return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
  };

  return (
    <div className="saved-posts-page">
      <div className="page-header">
        <h1>Danh sách tin đã lưu</h1>
        <p>Danh sách các tin bạn đã lưu để xem sau.</p>
      </div>

      <div className="saved-list">
        {loading ? (
          <div className="empty-state">Đang tải...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">Bạn chưa lưu tin nào.</div>
        ) : (
          <div className="cards-grid">
            {posts.map(post => (
              <div key={post._id} className="saved-card">
                <Link to={`/tin-dang/${post._id}`} className="card-link">
                  <div className="card-image">
                    {post.images && post.images[0] ? (
                      <img src={`${API_URL}${post.images[0]}`} alt={post.tieu_de} />
                    ) : (
                      <div className="no-thumb">No image</div>
                    )}
                  </div>
                </Link>
                <div className="card-body">
                  <Link to={`/tin-dang/${post._id}`} className="card-title">{post.tieu_de}</Link>
                  <div className="card-price">{formatPrice(post.gia)}</div>
                  <div className="card-actions">
                    <button className="btn btn-outline" onClick={() => removeSaved(post._id)}>Bỏ lưu</button>
                    <Link to={`/tin-dang/${post._id}`} className="btn btn-primary">Xem chi tiết</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPosts;
