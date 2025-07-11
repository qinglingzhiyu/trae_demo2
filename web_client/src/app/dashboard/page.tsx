'use client';

import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Space, Typography, Avatar, Spin } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  UserAddOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import { Line, Pie } from '@ant-design/plots';
import { useRouter } from 'next/navigation';
import MainLayout from '@/layouts/MainLayout';

const { Title, Text } = Typography;

type OrderTrendPeriod = 'day' | 'week' | 'month';
type UserDistributionType = 'gender' | 'age' | 'region';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orderTrendPeriod, setOrderTrendPeriod] = useState<OrderTrendPeriod>('day');
  const [userDistributionType, setUserDistributionType] = useState<UserDistributionType>('gender');
  const [stats] = useState({
    totalUsers: 8846,
    totalPatients: 12721,
    totalOrders: 2856,
    totalRevenue: 198520,
    userGrowth: 12.5,
    patientGrowth: 8.2,
    orderGrowth: 15.3,
    revenueGrowth: 23.1,
  });
  const [recentActivities] = useState([
    {
      id: 1,
      user: '管理员',
      action: '创建了新用户',
      target: '张三',
      time: '2分钟前',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80',
      online: true,
    },
    {
      id: 2,
      user: '前台接待',
      action: '添加了新就诊人',
      target: '李四',
      time: '15分钟前',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80',
      online: true,
    },
    {
      id: 3,
      user: '财务人员',
      action: '处理了订单',
      target: '#20230615001',
      time: '30分钟前',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80',
      online: false,
    },
    {
      id: 4,
      user: '管理员',
      action: '更新了系统设置',
      target: '',
      time: '1小时前',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80',
      online: true,
    },
    {
      id: 5,
      user: '前台接待',
      action: '创建了新订单',
      target: '#20230615002',
      time: '2小时前',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80',
      online: true,
    },
  ]);

  // 模拟数据加载
  const fetchData = async () => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  // 初始化数据
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        await fetchData();
      } finally {
        setLoading(false);
      }
    };
    
    initData();
  }, []);

  const quickActions = [
    {
      title: '创建用户',
      icon: <UserAddOutlined />,
      color: '#1890FF',
      bgColor: 'bg-blue-100',
      action: () => router.push('/users/create'),
    },
    {
      title: '添加就诊人',
      icon: <TeamOutlined />,
      color: '#52C41A',
      bgColor: 'bg-green-100',
      action: () => router.push('/patients/create'),
    },
    {
      title: '创建订单',
      icon: <FileTextOutlined />,
      color: '#FAAD14',
      bgColor: 'bg-yellow-100',
      action: () => router.push('/orders/create'),
    },
    {
      title: '数据报表',
      icon: <BarChartOutlined />,
      color: '#722ED1',
      bgColor: 'bg-purple-100',
      action: () => router.push('/analytics'),
    },
    {
      title: '权限设置',
      icon: <SettingOutlined />,
      color: '#F5222D',
      bgColor: 'bg-red-100',
      action: () => router.push('/settings/permissions'),
    },
    {
      title: '更多功能',
      icon: <EllipsisOutlined />,
      color: '#8C8C8C',
      bgColor: 'bg-gray-100',
      action: () => {},
    },
  ];

  // 订单趋势数据
  const orderTrendData = {
    day: [
      { time: '1日', value: 150 },
      { time: '2日', value: 120 },
      { time: '3日', value: 180 },
      { time: '4日', value: 160 },
      { time: '5日', value: 200 },
      { time: '6日', value: 170 },
      { time: '7日', value: 220 }
    ],
    week: [
      { time: '第1周', value: 800 },
      { time: '第2周', value: 950 },
      { time: '第3周', value: 1100 },
      { time: '第4周', value: 1200 }
    ],
    month: [
      { time: '1月', value: 2800 },
      { time: '2月', value: 3200 },
      { time: '3月', value: 2900 },
      { time: '4月', value: 3500 },
      { time: '5月', value: 3800 },
      { time: '6月', value: 4200 }
    ]
  };

  // 用户分布数据
  const userDistributionData = {
    gender: [
      { type: '男性', value: 52, color: '#1890FF' },
      { type: '女性', value: 48, color: '#F5222D' }
    ],
    age: [
      { type: '18-24岁', value: 28, color: '#1890FF' },
      { type: '25-34岁', value: 22, color: '#13C2C2' },
      { type: '35-44岁', value: 25, color: '#52C41A' },
      { type: '45-54岁', value: 15, color: '#FAAD14' },
      { type: '55岁以上', value: 10, color: '#F5222D' }
    ],
    region: [
      { type: '北京', value: 25, color: '#1890FF' },
      { type: '上海', value: 20, color: '#13C2C2' },
      { type: '广州', value: 18, color: '#52C41A' },
      { type: '深圳', value: 15, color: '#FAAD14' },
      { type: '杭州', value: 12, color: '#F5222D' },
      { type: '其他', value: 10, color: '#722ED1' }
    ]
  };

  // 图表组件
  const LineChart = () => {
    const currentData = orderTrendData[orderTrendPeriod];
    
    const config = {
      data: currentData,
      xField: 'time',
      yField: 'value',
      height: 220,
      smooth: true,
      point: {
        size: 4,
        shape: 'circle',
        style: {
          fill: '#1890FF',
          stroke: '#1890FF',
          lineWidth: 2,
        },
      },
      line: {
        style: {
          stroke: '#1890FF',
          lineWidth: 2,
        },
      },
      area: {
        style: {
          fill: 'rgba(24, 144, 255, 0.1)',
        },
      },
      tooltip: {
        showMarkers: true,
        showContent: true,
        formatter: (datum: {time: string, value: number}) => {
           return {
             name: '订单数',
             value: datum.value,
           };
         },
      },
      grid: {
        line: {
          style: {
            stroke: '#f0f0f0',
            lineWidth: 1,
          },
        },
      },
    };
    
    return (
      <div className="w-full h-[220px]">
        <Line {...config} />
      </div>
    );
  };

  const PieChart = () => {
    // 使用简单的测试数据
    const testData = [
      { type: '男性', value: 52 },
      { type: '女性', value: 48 }
    ];
    
    const currentData = userDistributionData[userDistributionType] || testData;
    
    console.log('PieChart data:', currentData); // 调试信息
    console.log('userDistributionType:', userDistributionType); // 调试信息
    
    const config = {
      data: currentData,
      angleField: 'value',
      colorField: 'type',
      radius: 0.6,
      height: 200,
      width: 300,
      autoFit: false,
      appendPadding: 10,
      label: {
        type: 'inner',
        offset: '-30%',
        content: '{percentage}',
        style: {
          fontSize: 14,
          textAlign: 'center',
        },
      },
      tooltip: {
        formatter: (datum: {type: string, value: number}) => {
           return {
             name: datum.type,
             value: `${datum.value}%`,
           };
         },
      },
      legend: {
        position: 'bottom',
      },
    };
    
    return (
      <div className="w-full h-[220px] flex justify-center items-center">
        <div style={{ width: 300, height: 200 }}>
          <Pie {...config} />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">
        {/* 页面标题和欢迎信息 */}
        <div className="mb-6">
          <Title level={2} className="!mb-2 text-gray-800">
            工作台
          </Title>
          <Text className="text-gray-600">
            欢迎回来，今天是 {new Date().toLocaleDateString('zh-CN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}
          </Text>
        </div>

        {/* 数据概览卡片 */}
        <Row gutter={[24, 24]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-sm border-0">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-gray-600 text-sm mb-1">总用户数</div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {stats.totalUsers.toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm">
                    <ArrowUpOutlined className="text-green-500 mr-1" />
                    <span className="text-green-500">{stats.userGrowth}%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserOutlined className="text-blue-500 text-xl" />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-sm border-0">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-gray-600 text-sm mb-1">就诊人数量</div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {stats.totalPatients.toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm">
                    <ArrowUpOutlined className="text-green-500 mr-1" />
                    <span className="text-green-500">{stats.patientGrowth}%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TeamOutlined className="text-green-500 text-xl" />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-sm border-0">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-gray-600 text-sm mb-1">本月订单数</div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {stats.totalOrders.toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm">
                    <ArrowUpOutlined className="text-green-500 mr-1" />
                    <span className="text-green-500">{stats.orderGrowth}%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <ShoppingCartOutlined className="text-yellow-500 text-xl" />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-sm border-0">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-gray-600 text-sm mb-1">本月收入</div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    ¥{stats.totalRevenue.toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm">
                    <ArrowUpOutlined className="text-green-500 mr-1" />
                    <span className="text-green-500">{stats.revenueGrowth}%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <DollarOutlined className="text-red-500 text-xl" />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 图表区域 */}
        <Row gutter={[24, 24]} className="mb-6">
          <Col xs={24} lg={12}>
            <Card className="shadow-sm border-0">
              <div className="flex justify-between items-center mb-4">
                <Title level={4} className="!mb-0">订单趋势</Title>
                <Space>
                  <Button 
                    size="small" 
                    type={orderTrendPeriod === 'day' ? 'primary' : 'default'}
                    onClick={() => setOrderTrendPeriod('day')}
                  >
                    日
                  </Button>
                  <Button 
                    size="small" 
                    type={orderTrendPeriod === 'week' ? 'primary' : 'default'}
                    onClick={() => setOrderTrendPeriod('week')}
                  >
                    周
                  </Button>
                  <Button 
                    size="small" 
                    type={orderTrendPeriod === 'month' ? 'primary' : 'default'}
                    onClick={() => setOrderTrendPeriod('month')}
                  >
                    月
                  </Button>
                </Space>
              </div>
              <LineChart />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card className="shadow-sm border-0">
              <div className="flex justify-between items-center mb-4">
                <Title level={4} className="!mb-0">用户分布</Title>
                <Space>
                  <Button 
                    size="small" 
                    type={userDistributionType === 'gender' ? 'primary' : 'default'}
                    onClick={() => setUserDistributionType('gender')}
                  >
                    性别
                  </Button>
                  <Button 
                    size="small" 
                    type={userDistributionType === 'age' ? 'primary' : 'default'}
                    onClick={() => setUserDistributionType('age')}
                  >
                    年龄段
                  </Button>
                  <Button 
                    size="small" 
                    type={userDistributionType === 'region' ? 'primary' : 'default'}
                    onClick={() => setUserDistributionType('region')}
                  >
                    地区
                  </Button>
                </Space>
              </div>
              <PieChart />
            </Card>
          </Col>
        </Row>

        {/* 快捷操作 */}
        <div className="mb-6">
          <Title level={4} className="!mb-4">快捷操作</Title>
          <Row gutter={[16, 16]}>
            {quickActions.map((action, index) => (
              <Col key={index} xs={12} sm={8} md={6} lg={4}>
                <div 
                  className="text-center p-4 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-50"
                  onClick={action.action}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${action.bgColor} mb-3`}>
                    <span style={{ color: action.color, fontSize: '20px' }}>
                      {action.icon}
                    </span>
                  </div>
                  <div className="text-gray-600 text-sm">{action.title}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* 最近活动 */}
        <Card className="shadow-sm border-0">
          <div className="flex justify-between items-center mb-4">
            <Title level={4} className="!mb-0">最近活动</Title>
            <Button type="link" className="text-blue-500">查看更多</Button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className="relative mr-4">
                  <Avatar 
                    size={40} 
                    src={activity.avatar}
                    className="border-2 border-white shadow-sm"
                  />
                  <div className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    activity.online ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                </div>
                <div className="flex-1">
                  <div className="text-gray-800">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-gray-600 mx-1">{activity.action}</span>
                    {activity.target && (
                      <span className="text-blue-500 font-medium">{activity.target}</span>
                    )}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;