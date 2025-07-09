'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Checkbox, Space } from 'antd';
import { UserOutlined, LockOutlined, MedicineBoxOutlined, WechatOutlined, MobileOutlined, QrcodeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { authApi } from '@/api/users';
import { storage } from '@/utils';
import type { LoginRequest } from '@/types';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();

  const handleLogin = async (values: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authApi.login(values);
      
      // 保存token和用户信息
      storage.set('token', response.access_token);
      storage.set('user', response.user);
      
      message.success('登录成功');
      router.push('/dashboard');
    } catch (error: any) {
      message.error(error.response?.data?.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F5F5F5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url("https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(245, 245, 245, 0.95)',
        }}
      />
      
      <Card
        style={{
          width: 400,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* 头部 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Space direction="vertical" size="small">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <MedicineBoxOutlined style={{ fontSize: 32, color: '#1890FF', marginRight: 12 }} />
              <Title level={2} style={{ margin: 0, color: '#262626' }}>
                医疗CRM管理后台
              </Title>
            </div>
            <Text type="secondary">专业的医疗客户关系管理系统</Text>
          </Space>
        </div>

        {/* 默认账号提示 */}
        <div style={{ 
          background: '#F6FFED', 
          border: '1px solid #B7EB8F', 
          borderRadius: 6, 
          padding: 12, 
          marginBottom: 24 
        }}>
          <div style={{ fontSize: 12, color: '#52C41A', fontWeight: 500, marginBottom: 4 }}>
            💡 默认管理员账号
          </div>
          <div style={{ fontSize: 12, color: '#389E0D' }}>
            📱 手机号: 13800138000
          </div>
          <div style={{ fontSize: 12, color: '#389E0D' }}>
            🔑 密码: admin123
          </div>
        </div>

        {/* 登录表单 */}
        <Form
          form={form}
          name="login"
          onFinish={handleLogin}
          autoComplete="off"
          size="large"
          initialValues={{
            phone: '13800138000',
            password: 'admin123',
            remember: true,
          }}
        >
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#8C8C8C' }} />}
              placeholder="请输入手机号"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#8C8C8C' }} />}
              placeholder="请输入密码"
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <a href="#" style={{ color: '#1890FF' }}>
                忘记密码?
              </a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%', height: 40 }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        {/* 其他登录方式 */}
        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            其他登录方式
          </Text>
          <div style={{ marginTop: 8 }}>
            <Space size="large">
              <WechatOutlined
                style={{
                  fontSize: 20,
                  color: '#8C8C8C',
                  cursor: 'pointer',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1890FF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8C8C8C')}
              />
              <MobileOutlined
                style={{
                  fontSize: 20,
                  color: '#8C8C8C',
                  cursor: 'pointer',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1890FF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8C8C8C')}
              />
              <QrcodeOutlined
                style={{
                  fontSize: 20,
                  color: '#8C8C8C',
                  cursor: 'pointer',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1890FF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8C8C8C')}
              />
            </Space>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;