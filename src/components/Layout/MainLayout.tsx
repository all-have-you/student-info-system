import React from 'react';
import { Layout, Menu, Dropdown, Avatar, Button, Space, Typography } from 'antd';
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  UserAddOutlined,
  BookOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import './MainLayout.less';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onLogout }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const location = useLocation();

  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <HomeOutlined />,
      label: <Link to="/dashboard">首页</Link>,
    },
    {
      key: '/student-info',
      icon: <UserAddOutlined />,
      label: <Link to="/student-info">基本信息</Link>,
    },
    {
      key: '/score-manage',
      icon: <BookOutlined />,
      label: <Link to="/score-manage">成绩管理</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      label: '个人资料',
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
    },
  ];

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === 'logout') {
      onLogout();
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <Title level={4} style={{ color: 'white', margin: '16px' }}>
            学生信息管理
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggle}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div className="user-info">
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleMenuClick,
              }}
            >
              <Space>
                <Avatar icon={<UserOutlined />} />
                <span>{user?.username || '管理员'}</span>
              </Space>
            </Dropdown>
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: 8,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;