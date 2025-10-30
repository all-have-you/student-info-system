import React from 'react';
import { Card, Statistic, Row, Col, Typography } from 'antd';
import { UserOutlined, BookOutlined, TrophyOutlined, LineChartOutlined } from '@ant-design/icons';
import MainLayout from '../../components/Layout/MainLayout';
import './index.less';

const { Title, Text } = Typography;

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  // 模拟数据
  const studentCount = 120;
  const scoreCount = 120;
  const avgScore = 85.5;
  const passRate = 92.3;

  return (
    <MainLayout onLogout={onLogout}>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <Title level={2}>仪表盘</Title>
          <Text type="secondary">欢迎回来，教师</Text>
        </div>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="学生总数"
                value={studentCount}
                prefix={<UserOutlined style={{ color: '#3f8600' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="成绩记录"
                value={scoreCount}
                prefix={<BookOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="平均成绩"
                value={avgScore}
                precision={1}
                prefix={<LineChartOutlined style={{ color: '#722ed1' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="及格率"
                value={passRate}
                precision={1}
                suffix="%"
                prefix={<TrophyOutlined style={{ color: '#fa8c16' }} />}
              />
            </Card>
          </Col>
        </Row>
        
        <div className="dashboard-content">
          <Card title="系统功能" className="function-card">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={8}>
                <div className="function-item">
                  <UserOutlined className="function-icon" />
                  <div>
                    <Title level={5}>基本信息管理</Title>
                    <Text type="secondary">管理学生基本信息</Text>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <div className="function-item">
                  <BookOutlined className="function-icon" />
                  <div>
                    <Title level={5}>成绩管理</Title>
                    <Text type="secondary">管理学生成绩信息</Text>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <div className="function-item">
                  <LineChartOutlined className="function-icon" />
                  <div>
                    <Title level={5}>数据统计</Title>
                    <Text type="secondary">查看统计分析报告</Text>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;