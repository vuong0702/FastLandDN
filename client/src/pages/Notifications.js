import React from 'react';
import './Notifications.css';

const Notifications = () => {
  return (
    <div className="notifications-page">
      <div className="page-header">
        <h1>Thông báo</h1>
        <p>Danh sách thông báo của bạn sẽ xuất hiện ở đây.</p>
      </div>

      <div className="notifications-list">
        <div className="empty-state">Hiện chưa có thông báo.</div>
      </div>
    </div>
  );
};

export default Notifications;
