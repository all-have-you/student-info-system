import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Spin, message } from 'antd';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentInfo from './pages/StudentInfo';
import ScoreManage from './pages/ScoreManage';
import { AppProvider } from './context/AppContext';

// 测试页面组件
const TestPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h1>测试页面</h1>
      <p>这是一个测试页面，用于验证应用是否正常运行。</p>
    </div>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 模拟检查登录状态
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = async (username: string, _password: string) => {
    try {
      setLoading(true);
      // 模拟登录API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟登录成功
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify({ username, role: 'teacher' }));
      
      setIsAuthenticated(true);
      message.success('登录成功');
      navigate('/dashboard');
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
    message.success('已退出登录');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <AppProvider>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/test" element={<TestPage />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/student-info" 
          element={isAuthenticated ? <StudentInfo /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/score-manage" 
          element={isAuthenticated ? <ScoreManage /> : <Navigate to="/login" />} 
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </AppProvider>
  );
};

export default App;