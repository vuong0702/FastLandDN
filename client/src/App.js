
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TinDangDetail from './pages/TinDangDetail';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import MyPosts from './pages/MyPosts';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import SavedPosts from './pages/SavedPosts';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import GioiThieu from './pages/GioiThieu';
import DuAn from './pages/DuAn';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gioi-thieu" element={<GioiThieu />} />
              <Route path="/du-an" element={<DuAn />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/tin-dang/:id" element={<TinDangDetail />} />
              <Route path="/create-post" element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              } />
              <Route path="/edit-post/:id" element={
                <ProtectedRoute>
                  <EditPost />
                </ProtectedRoute>
              } />
              <Route path="/my-posts" element={
                <ProtectedRoute>
                  <MyPosts />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />
              <Route path="/saved-posts" element={
                <ProtectedRoute>
                  <SavedPosts />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="quan_tri">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/staff" element={
                <ProtectedRoute requiredRole="nhan_vien">
                  <StaffDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
