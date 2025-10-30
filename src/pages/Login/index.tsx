import React from 'react';
import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Card, Typography, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './index.less';

const { Title, Text } = Typography;

// 登录表单验证规则
const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .required('用户名不能为空')
    .min(3, '用户名至少3个字符')
    .max(20, '用户名最多20个字符'),
  password: Yup.string()
    .required('密码不能为空')
    .min(6, '密码至少6个字符')
    .max(20, '密码最多20个字符'),
});

interface LoginProps {
  onLogin: (username: string, password: string) => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const handleSubmit = async (values: { username: string; password: string }) => {
    await onLogin(values.username, values.password);
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <Title level={2}>学生信息管理系统</Title>
          <Text type="secondary">教师登录入口</Text>
        </div>
        <Divider />
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <div className="form-item">
                <Field name="username">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      placeholder="请输入用户名"
                      autoComplete="username"
                    />
                  )}
                </Field>
                <ErrorMessage name="username" component="div" className="error-message" />
              </div>
              <div className="form-item">
                <Field name="password">
                  {({ field }: FieldProps) => (
                    <Input.Password
                      {...field}
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      placeholder="请输入密码"
                      autoComplete="current-password"
                    />
                  )}
                </Field>
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>
              <div className="form-actions">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isSubmitting}
                  size="large"
                >
                  登录
                </Button>
              </div>
            </Form>
          )}
        </Formik>
        <div className="login-footer">
          <Space size="middle">
            <Text type="secondary">© 2025 学生信息管理系统</Text>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default Login;