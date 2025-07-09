'use client';

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Tabs,
  Select,
  DatePicker,
  Button,
  Table,
  Space,
  Typography,
  Progress,
  Tag,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  TeamOutlined,
  ReloadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie, Funnel } from '@ant-design/plots';
import MainLayout from '@/layouts/MainLayout';
import { formatCurrency } from '@/utils';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;


interface StatCardProps {
  title: string;
  value: number;
  prefix?: React.ReactNode;
  suffix?: string;
  trend?: number;
  formatter?: (value: string | number) => string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, prefix, suffix, trend, formatter }) => {
  const trendIcon = trend && trend > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
  const trendColor = trend && trend > 0 ? '#52c41a' : '#f5222d';
  
  return (
    <Card>
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        suffix={suffix}
        formatter={formatter}
        valueStyle={{ color: '#1890ff' }}
      />
      {trend && (
        <div style={{ marginTop: 8 }}>
          <span style={{ color: trendColor }}>
            {trendIcon} {Math.abs(trend)}%
          </span>
          <span style={{ marginLeft: 8, color: '#666' }}>较上期</span>
        </div>
      )}
    </Card>
  );
};

const AnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [activeTab, setActiveTab] = useState('overview');

  // 模拟数据
  const overviewStats = {
    totalUsers: { value: 12580, trend: 12.5 },
    totalOrders: { value: 3456, trend: 8.2 },
    totalRevenue: { value: 2580000, trend: -2.1 },
    activeUsers: { value: 8920, trend: 15.3 },
  };

  // 趋势图数据
  const trendData = [
    { date: '2023-12-01', users: 120, orders: 45, revenue: 12000 },
    { date: '2023-12-02', users: 132, orders: 52, revenue: 15000 },
    { date: '2023-12-03', users: 101, orders: 38, revenue: 11000 },
    { date: '2023-12-04', users: 134, orders: 58, revenue: 18000 },
    { date: '2023-12-05', users: 90, orders: 42, revenue: 13000 },
    { date: '2023-12-06', users: 230, orders: 78, revenue: 25000 },
    { date: '2023-12-07', users: 210, orders: 65, revenue: 22000 },
  ];

  // 用户年龄分布数据
  const ageDistributionData = [
    { age: '18-25', count: 2580, percent: 20.5 },
    { age: '26-35', count: 4320, percent: 34.3 },
    { age: '36-45', count: 3240, percent: 25.8 },
    { age: '46-55', count: 1680, percent: 13.4 },
    { age: '55+', count: 760, percent: 6.0 },
  ];

  // 订单状态分布数据
  const orderStatusData = [
    { status: '已完成', count: 2156, percent: 62.4 },
    { status: '进行中', count: 856, percent: 24.8 },
    { status: '已取消', count: 324, percent: 9.4 },
    { status: '待处理', count: 120, percent: 3.4 },
  ];

  // 服务类型分布数据
  const serviceTypeData = [
    { type: '咨询', count: 1580, percent: 45.7 },
    { type: '治疗', count: 980, percent: 28.4 },
    { type: '检查', count: 560, percent: 16.2 },
    { type: '药品', count: 336, percent: 9.7 },
  ];

  // 转化漏斗数据
  const funnelData = [
    { stage: '访问', count: 10000, percent: 100 },
    { stage: '注册', count: 6500, percent: 65 },
    { stage: '咨询', count: 4200, percent: 42 },
    { stage: '预约', count: 2800, percent: 28 },
    { stage: '完成', count: 2156, percent: 21.6 },
  ];

  // 自定义报表数据
  const customReports = [
    {
      id: 1,
      name: '月度用户增长分析',
      type: '用户分析',
      startDate: '2023-06-01',
      endDate: '2023-06-30',
      status: '已完成',
    },
    {
      id: 2,
      name: '季度收入报表',
      type: '财务分析',
      startDate: '2023-04-01',
      endDate: '2023-06-30',
      status: '进行中',
    },
    {
      id: 3,
      name: '服务满意度分析',
      type: '服务分析',
      startDate: '2023-05-15',
      endDate: '2023-06-15',
      status: '已完成',
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    // 模拟数据刷新
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    // 模拟导出功能
    console.log('导出数据');
  };

  // 趋势图配置
  const trendConfig = {
    data: trendData,
    xField: 'date',
    yField: 'users',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  // 年龄分布柱状图配置
  const ageConfig = {
    data: ageDistributionData,
    xField: 'age',
    yField: 'count',
    color: '#1890ff',
    columnWidthRatio: 0.6,
  };

  // 饼图配置
  const pieConfig = {
    data: orderStatusData,
    angleField: 'count',
    colorField: 'status',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
  };

  // 漏斗图配置
  const funnelConfig = {
    data: funnelData,
    xField: 'stage',
    yField: 'count',
    color: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'],
  };

  const reportColumns = [
    {
      title: '报表名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '报表类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '已完成' ? 'green' : 'orange'}>{status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" size="small">
            查看
          </Button>
          <Button type="link" size="small">
            编辑
          </Button>
          <Button type="link" size="small">
            导出
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <div>
        {/* 页面标题 */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              数据分析概览
            </Title>
          </Col>
          <Col>
            <Space>
              <RangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
              />
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
                刷新
              </Button>
              <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
                导出
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="总用户数"
              value={overviewStats.totalUsers.value}
              prefix={<UserOutlined />}
              trend={overviewStats.totalUsers.trend}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="总订单数"
              value={overviewStats.totalOrders.value}
              prefix={<ShoppingCartOutlined />}
              trend={overviewStats.totalOrders.trend}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="总收入"
              value={overviewStats.totalRevenue.value}
              prefix={<DollarOutlined />}
              trend={overviewStats.totalRevenue.trend}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="活跃用户"
              value={overviewStats.activeUsers.value}
              prefix={<TeamOutlined />}
              trend={overviewStats.activeUsers.trend}
            />
          </Col>
        </Row>

        {/* 选项卡内容 */}
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={[
            {
              key: 'overview',
              label: '概览',
              children: (
                <Row gutter={[16, 16]}>
                  {/* 业务趋势图 */}
                  <Col span={24}>
                    <Card title="业务趋势" style={{ marginBottom: 16 }}>
                      <Line {...trendConfig} height={300} />
                    </Card>
                  </Col>
                  
                  {/* 用户年龄分布 */}
                  <Col xs={24} lg={12}>
                    <Card title="用户年龄分布">
                      <Column {...ageConfig} height={250} />
                    </Card>
                  </Col>
                  
                  {/* 订单状态分布 */}
                  <Col xs={24} lg={12}>
                    <Card title="订单状态分布">
                      <Pie {...pieConfig} height={250} />
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'users',
              label: '用户分析',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card title="用户年龄分布">
                      <Column {...ageConfig} height={300} />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="用户活跃度">
                      <div style={{ padding: '20px 0' }}>
                        {ageDistributionData.map((item, index) => (
                          <div key={index} style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span>{item.age}岁</span>
                              <span>{item.count}人</span>
                            </div>
                            <Progress percent={item.percent} strokeColor="#1890ff" />
                          </div>
                        ))}
                      </div>
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'orders',
              label: '订单分析',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card title="订单状态分布">
                      <Pie {...pieConfig} height={300} />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="订单转化漏斗">
                      <Funnel {...funnelConfig} height={300} />
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'services',
              label: '服务分析',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card title="服务类型分布">
                      <Pie
                        {...{
                          ...pieConfig,
                          data: serviceTypeData,
                          angleField: 'count',
                          colorField: 'type',
                        }}
                        height={300}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="服务满意度">
                      <div style={{ padding: '20px 0' }}>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span>非常满意</span>
                            <span>45%</span>
                          </div>
                          <Progress percent={45} strokeColor="#52c41a" />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span>满意</span>
                            <span>35%</span>
                          </div>
                          <Progress percent={35} strokeColor="#1890ff" />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span>一般</span>
                            <span>15%</span>
                          </div>
                          <Progress percent={15} strokeColor="#faad14" />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span>不满意</span>
                            <span>5%</span>
                          </div>
                          <Progress percent={5} strokeColor="#f5222d" />
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'custom',
              label: '自定义报表',
              children: (
                <Card>
                  <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                    <Col xs={24} sm={8}>
                      <Select placeholder="报表类型" style={{ width: '100%' }}>
                        <Option value="user">用户分析报表</Option>
                        <Option value="order">订单分析报表</Option>
                        <Option value="service">服务分析报表</Option>
                        <Option value="finance">财务分析报表</Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Select placeholder="时间范围" style={{ width: '100%' }}>
                        <Option value="day">按日</Option>
                        <Option value="week">按周</Option>
                        <Option value="month">按月</Option>
                        <Option value="quarter">按季度</Option>
                        <Option value="year">按年</Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Button type="primary" style={{ width: '100%' }}>
                        生成报表
                      </Button>
                    </Col>
                  </Row>
                  
                  <Table
                    dataSource={customReports}
                    columns={reportColumns}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) =>
                        `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                    }}
                  />
                </Card>
              ),
            },
          ]}
        />
      </div>
    </MainLayout>
  );
};

export default AnalyticsPage;