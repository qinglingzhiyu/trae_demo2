'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  Descriptions,
  Button,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Spin,
  message,
  Avatar,
} from 'antd';
import {
  EditOutlined,
  ArrowLeftOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import MainLayout from '@/layouts/MainLayout';
import { usersApi } from '@/api/users';
import { formatDate, getUserRoleLabel, getUserStatusLabel, getUserStatusColor } from '@/utils';
import type { User, UserRole } from '@/types';

const { Title, Text } = Typography;

const UserDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const userId = Number(params.id);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // 获取用户详情
  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getUser(userId);
      setUser(response);
    } catch (error) {
      message.error('获取用户详情失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (loading) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Text>用户不存在</Text>
        </div>
      </MainLayout>
    );
  }

  const getRoleConfig = (role: string) => {
    const roleMap: Record<string, { label: string; color: string }> = {
      ADMIN: { label: '管理员', color: 'red' },
      DOCTOR: { label: '医生', color: 'blue' },
      NURSE: { label: '护士', color: 'green' },
      RECEPTIONIST: { label: '前台', color: 'orange' },
    };
    return roleMap[role] || { label: role, color: 'default' };
  };

  const roleConfig = getRoleConfig(user.role);

  return (
    <MainLayout>
      <div>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Space>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => router.back()}
              >
                返回
              </Button>
              <Title level={2} style={{ margin: 0 }}>
                用户详情
              </Title>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => router.push(`/users/${userId}/edit`)}
            >
              编辑用户
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* 基本信息 */}
          <Col xs={24} lg={16}>
            <Card title="基本信息">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
                  <Avatar
                    size={120}
                    icon={<UserOutlined />}
                    style={{
                      backgroundColor: roleConfig.color === 'red' ? '#ff4d4f' :
                                     roleConfig.color === 'blue' ? '#1890ff' :
                                     roleConfig.color === 'green' ? '#52c41a' :
                                     roleConfig.color === 'orange' ? '#fa8c16' : '#d9d9d9'
                    }}
                  />
                  <div style={{ marginTop: 16 }}>
                    <Title level={4} style={{ margin: 0 }}>
                      {user.username}
                    </Title>
                    <Tag color={roleConfig.color} style={{ marginTop: 8 }}>
                      {roleConfig.label}
                    </Tag>
                  </div>
                </Col>
                <Col xs={24} sm={16}>
                  <Descriptions column={1} labelStyle={{ width: '120px' }}>
                    <Descriptions.Item label="用户ID">
                      {user.id}
                    </Descriptions.Item>
                    <Descriptions.Item label="用户名">
                      {user.username}
                    </Descriptions.Item>
                    <Descriptions.Item label="邮箱">
                      {user.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="角色">
                      <Tag color={roleConfig.color}>
                        {roleConfig.label}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="状态">
                      <Tag color={getUserStatusColor(user.status)}>
                        {getUserStatusLabel(user.status)}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="创建时间">
                      {formatDate(user.createdAt)}
                    </Descriptions.Item>
                    <Descriptions.Item label="更新时间">
                      {formatDate(user.updatedAt)}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* 权限信息 */}
          <Col xs={24} lg={8}>
            <Card title="权限信息">
              <Descriptions column={1}>
                <Descriptions.Item label="角色权限">
                  <div>
                    {user.role === 'ADMIN' && (
                      <div>
                        <Tag color="red">系统管理</Tag>
                        <Tag color="red">用户管理</Tag>
                        <Tag color="red">数据统计</Tag>
                      </div>
                    )}
                    {user.role === 'DOCTOR' && (
                      <div>
                        <Tag color="blue">就诊人管理</Tag>
                        <Tag color="blue">订单管理</Tag>
                        <Tag color="blue">医疗记录</Tag>
                      </div>
                    )}
                    {user.role === 'NURSE' && (
                      <div>
                        <Tag color="green">就诊人管理</Tag>
                        <Tag color="green">订单查看</Tag>
                      </div>
                    )}
                    {user.role === 'RECEPTIONIST' && (
                      <div>
                        <Tag color="orange">就诊人管理</Tag>
                        <Tag color="orange">订单创建</Tag>
                      </div>
                    )}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="账户状态">
                  <div>
                    {user.status === 'ACTIVE' && (
                      <Text type="success">账户正常，可正常使用所有功能</Text>
                    )}
                    {user.status === 'INACTIVE' && (
                      <Text type="warning">账户未激活，需要激活后才能使用</Text>
                    )}
                    {user.status === 'SUSPENDED' && (
                      <Text type="danger">账户已暂停，无法登录系统</Text>
                    )}
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        {/* 操作历史 */}
        <Row style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card title="操作历史">
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                暂无操作历史记录
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default UserDetailPage;