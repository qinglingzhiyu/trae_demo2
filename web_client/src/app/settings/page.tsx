'use client';

import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import {
  SettingOutlined,
  SecurityScanOutlined,
  UserOutlined,
  TeamOutlined,
  DatabaseOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import MainLayout from '../../layouts/MainLayout';

interface SettingCard {
  key: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

const SystemSettings: React.FC = () => {
  const router = useRouter();

  const settingCards: SettingCard[] = [
    {
      key: 'permissions',
      title: '权限管理',
      description: '管理用户角色和权限设置',
      icon: <TeamOutlined style={{ fontSize: '32px' }} />,
      path: '/settings/permissions',
      color: '#1890ff',
    },
    {
      key: 'accounts',
      title: '后端账号管理',
      description: '管理后端系统账号和用户信息',
      icon: <UserOutlined style={{ fontSize: '32px' }} />,
      path: '/settings/accounts',
      color: '#722ed1',
    },
    {
      key: 'parameters',
      title: '系统参数',
      description: '配置系统基础参数和功能设置',
      icon: <DatabaseOutlined style={{ fontSize: '32px' }} />,
      path: '/settings/parameters',
      color: '#52c41a',
    },
    {
      key: 'personal',
      title: '个人设置',
      description: '管理个人信息、安全和通知设置',
      icon: <UserOutlined style={{ fontSize: '32px' }} />,
      path: '/settings/personal',
      color: '#fa8c16',
    },
  ];

  const handleCardClick = (path: string) => {
    router.push(path);
  };

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SettingOutlined style={{ color: '#1890ff' }} />
            系统设置
          </h1>
          <p style={{ fontSize: '16px', color: '#666', marginTop: '8px', marginBottom: 0 }}>
            管理系统配置、用户权限和个人设置
          </p>
        </div>

        <Row gutter={[24, 24]}>
          {settingCards.map((card) => (
            <Col xs={24} sm={12} lg={8} key={card.key}>
              <Card
                hoverable
                style={{
                  height: '200px',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  border: `2px solid ${card.color}20`,
                  transition: 'all 0.3s ease',
                }}
                bodyStyle={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '24px',
                }}
                onClick={() => handleCardClick(card.path)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${card.color}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ color: card.color, marginBottom: '16px' }}>
                  {card.icon}
                </div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  margin: '0 0 8px 0',
                  color: '#262626'
                }}>
                  {card.title}
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#8c8c8c', 
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  {card.description}
                </p>
                <Button
                  type="primary"
                  style={{
                    marginTop: '16px',
                    backgroundColor: card.color,
                    borderColor: card.color,
                    borderRadius: '6px',
                  }}
                  size="small"
                >
                  进入设置
                </Button>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 快捷操作区域 */}
        <div style={{ marginTop: '48px' }}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BellOutlined style={{ color: '#1890ff' }} />
                <span>快捷操作</span>
              </div>
            }
            style={{ borderRadius: '12px' }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Button
                  block
                  size="large"
                  onClick={() => router.push('/settings/permissions')}
                  style={{ height: '60px', borderRadius: '8px' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TeamOutlined style={{ fontSize: '20px', marginBottom: '4px' }} />
                    <span>用户管理</span>
                  </div>
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button
                  block
                  size="large"
                  onClick={() => router.push('/settings/parameters')}
                  style={{ height: '60px', borderRadius: '8px' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <SettingOutlined style={{ fontSize: '20px', marginBottom: '4px' }} />
                    <span>系统配置</span>
                  </div>
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button
                  block
                  size="large"
                  onClick={() => router.push('/settings/personal')}
                  style={{ height: '60px', borderRadius: '8px' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <UserOutlined style={{ fontSize: '20px', marginBottom: '4px' }} />
                    <span>个人中心</span>
                  </div>
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button
                  block
                  size="large"
                  onClick={() => router.push('/settings/personal')}
                  style={{ height: '60px', borderRadius: '8px' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <SecurityScanOutlined style={{ fontSize: '20px', marginBottom: '4px' }} />
                    <span>安全设置</span>
                  </div>
                </Button>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default SystemSettings;