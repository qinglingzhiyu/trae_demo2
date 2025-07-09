'use client';

import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Button, Space, Typography, List, Avatar, message, Spin } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import MainLayout from '@/layouts/MainLayout';
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/utils';
import { userAPI, patientAPI, orderAPI } from '@/services/api';
import type { Order } from '@/types';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalOrders: 0,
    totalRevenue: 0,
    userGrowth: 0,
    patientGrowth: 0,
    orderGrowth: 0,
    revenueGrowth: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  // 获取统计数据
  const fetchStats = async () => {
    try {
      const [userStats, patientStats, orderStats] = await Promise.all([
        userAPI.getUserStats(),
        patientAPI.getPatientStats(),
        orderAPI.getOrderStats(),
      ]);

      setStats({
          totalUsers: userStats?.totalUsers || 0,
          totalPatients: patientStats?.totalPatients || 0,
          totalOrders: orderStats?.total || 0,
          totalRevenue: Number(orderStats?.totalAmount) || 0,
          userGrowth: ((userStats?.newUsersThisMonth || 0) / (userStats?.totalUsers || 1) * 100),
          patientGrowth: ((patientStats?.recentPatients || 0) / (patientStats?.totalPatients || 1) * 100),
          orderGrowth: ((orderStats?.pending || 0) / (orderStats?.total || 1) * 100),
          revenueGrowth: 15.2, // 暂时使用固定值，后续可根据历史数据计算
        });
    } catch (error) {
      console.error('获取统计数据失败:', error);
      message.error('获取统计数据失败');
    }
  };

  // 获取最近订单
  const fetchRecentOrders = async () => {
    try {
      const response = await orderAPI.getOrders({ page: 1, limit: 5 });
      setRecentOrders(response.data || []);
    } catch (error) {
      console.error('获取最近订单失败:', error);
      message.error('获取最近订单失败');
    }
  };

  // 初始化数据
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchStats(),
          fetchRecentOrders(),
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    initData();
  }, []);

  const quickActions = [
    {
      title: '新增用户',
      icon: <UserOutlined style={{ fontSize: 24, color: '#1890FF' }} />,
      description: '添加新的系统用户',
      action: () => router.push('/users/create'),
    },
    {
      title: '新增就诊人',
      icon: <TeamOutlined style={{ fontSize: 24, color: '#52C41A' }} />,
      description: '添加新的就诊人信息',
      action: () => router.push('/patients/create'),
    },
    {
      title: '创建订单',
      icon: <ShoppingCartOutlined style={{ fontSize: 24, color: '#FAAD14' }} />,
      description: '创建新的医疗订单',
      action: () => router.push('/orders/create'),
    },
  ];

  const orderColumns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text: string, record: Order) => (
        <a onClick={() => router.push(`/orders/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '就诊人',
      dataIndex: ['patient', 'name'],
      key: 'patientName',
    },
    {
      title: '订单类型',
      dataIndex: 'orderType',
      key: 'orderType',
      render: (type: string) => {
        const typeMap: Record<string, { label: string; color: string }> = {
          CONSULTATION: { label: '咨询', color: 'blue' },
          TREATMENT: { label: '治疗', color: 'green' },
          MEDICATION: { label: '药品', color: 'orange' },
          EXAMINATION: { label: '检查', color: 'purple' },
        };
        const config = typeMap[type] || { label: type, color: 'default' };
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getOrderStatusColor(status)}>
          {getOrderStatusLabel(status)}
        </Tag>
      ),
    },
    {
      title: '金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date, 'MM-dd HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Order) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/orders/${record.id}`)}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <MainLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Spin size="large" tip="加载中..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
        <Title level={2} style={{ marginBottom: 24 }}>
          工作台
        </Title>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="用户总数"
                value={stats.totalUsers}
                prefix={<UserOutlined />}
                suffix={
                  <span style={{ fontSize: 12 }}>
                    <ArrowUpOutlined style={{ color: '#52C41A' }} />
                    {stats.userGrowth}%
                  </span>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="就诊人总数"
                value={stats.totalPatients}
                prefix={<TeamOutlined />}
                suffix={
                  <span style={{ fontSize: 12 }}>
                    <ArrowUpOutlined style={{ color: '#52C41A' }} />
                    {stats.patientGrowth}%
                  </span>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="订单总数"
                value={stats.totalOrders}
                prefix={<ShoppingCartOutlined />}
                suffix={
                  <span style={{ fontSize: 12 }}>
                    <ArrowDownOutlined style={{ color: '#F5222D' }} />
                    {Math.abs(stats.orderGrowth)}%
                  </span>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总收入"
                value={stats.totalRevenue}
                prefix={<DollarOutlined />}
                precision={2}
                suffix={
                  <span style={{ fontSize: 12 }}>
                    <ArrowUpOutlined style={{ color: '#52C41A' }} />
                    {stats.revenueGrowth}%
                  </span>
                }
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* 快捷操作 */}
          <Col xs={24} lg={8}>
            <Card title="快捷操作" style={{ height: 400 }}>
              <List
                dataSource={quickActions}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      cursor: 'pointer',
                      padding: '16px 0',
                      borderRadius: 4,
                      transition: 'background-color 0.3s',
                    }}
                    onClick={item.action}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <List.Item.Meta
                      avatar={<Avatar size={48} icon={item.icon} style={{ backgroundColor: 'transparent' }} />}
                      title={<Text strong>{item.title}</Text>}
                      description={item.description}
                    />
                    <PlusOutlined style={{ fontSize: 16, color: '#8C8C8C' }} />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* 最近订单 */}
          <Col xs={24} lg={16}>
            <Card
              title="最近订单"
              extra={
                <Button type="link" onClick={() => router.push('/orders')}>
                  查看全部
                </Button>
              }
              style={{ height: 400 }}
            >
              <Table
                dataSource={recentOrders}
                columns={orderColumns}
                pagination={false}
                size="small"
                scroll={{ y: 280 }}
                rowKey="id"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;