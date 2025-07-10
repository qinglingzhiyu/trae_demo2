'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Tag,
  Row,
  Col,
  Descriptions,
  Typography,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  ExportOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Text } = Typography;

interface AuditLog {
  id: string;
  userId: string;
  username: string;
  userRealName: string;
  action: string;
  resource: string;
  resourceId?: string;
  method: string;
  path: string;
  ip: string;
  userAgent: string;
  requestData?: any;
  responseData?: any;
  status: 'success' | 'failed';
  errorMessage?: string;
  duration: number;
  createdAt: string;
}

const AuditLogsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [searchForm] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  // 模拟数据
  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async (params?: any) => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockData: AuditLog[] = [
        {
          id: '1',
          userId: 'user001',
          username: 'admin',
          userRealName: '系统管理员',
          action: '创建用户',
          resource: 'users',
          resourceId: 'user123',
          method: 'POST',
          path: '/api/users',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          requestData: {
            username: 'newuser',
            email: 'newuser@example.com',
            realName: '新用户',
          },
          responseData: {
            id: 'user123',
            message: '用户创建成功',
          },
          status: 'success',
          duration: 245,
          createdAt: '2024-01-15 14:30:25',
        },
        {
          id: '2',
          userId: 'user002',
          username: 'doctor01',
          userRealName: '张医生',
          action: '更新患者信息',
          resource: 'patients',
          resourceId: 'patient456',
          method: 'PUT',
          path: '/api/patients/patient456',
          ip: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          requestData: {
            phone: '13800138001',
            address: '北京市朝阳区xxx街道',
          },
          responseData: {
            message: '患者信息更新成功',
          },
          status: 'success',
          duration: 156,
          createdAt: '2024-01-15 14:25:10',
        },
        {
          id: '3',
          userId: 'user003',
          username: 'nurse01',
          userRealName: '李护士',
          action: '删除订单',
          resource: 'orders',
          resourceId: 'order789',
          method: 'DELETE',
          path: '/api/orders/order789',
          ip: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          requestData: {},
          status: 'failed',
          errorMessage: '权限不足，无法删除订单',
          duration: 89,
          createdAt: '2024-01-15 14:20:45',
        },
        {
          id: '4',
          userId: 'user001',
          username: 'admin',
          userRealName: '系统管理员',
          action: '登录系统',
          resource: 'auth',
          method: 'POST',
          path: '/api/auth/login',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          requestData: {
            username: 'admin',
          },
          responseData: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            message: '登录成功',
          },
          status: 'success',
          duration: 123,
          createdAt: '2024-01-15 14:15:30',
        },
        {
          id: '5',
          userId: 'user004',
          username: 'reception01',
          userRealName: '前台小王',
          action: '查看患者列表',
          resource: 'patients',
          method: 'GET',
          path: '/api/patients',
          ip: '192.168.1.103',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          requestData: {
            page: 1,
            pageSize: 20,
          },
          responseData: {
            total: 150,
            data: [],
          },
          status: 'success',
          duration: 67,
          createdAt: '2024-01-15 14:10:15',
        },
      ];

      setAuditLogs(mockData);
      setPagination({
        ...pagination,
        total: mockData.length,
      });
    } catch (error) {
      message.error('加载操作日志失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const values = await searchForm.validateFields();
    loadAuditLogs(values);
  };

  const handleReset = () => {
    searchForm.resetFields();
    loadAuditLogs();
  };

  const handleViewDetail = (record: AuditLog) => {
    setSelectedLog(record);
    setDetailModalVisible(true);
  };

  const handleExport = () => {
    message.info('导出功能开发中...');
  };

  const getStatusTag = (status: string) => {
    return status === 'success' ? (
      <Tag color="green">成功</Tag>
    ) : (
      <Tag color="red">失败</Tag>
    );
  };

  const getActionColor = (action: string) => {
    if (action.includes('创建') || action.includes('新增')) return 'blue';
    if (action.includes('更新') || action.includes('修改')) return 'orange';
    if (action.includes('删除')) return 'red';
    if (action.includes('登录') || action.includes('登出')) return 'green';
    return 'default';
  };

  const columns: ColumnsType<AuditLog> = [
    {
      title: '操作时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      sorter: true,
      render: (text: string) => (
        <Text style={{ fontSize: '12px' }}>{text}</Text>
      ),
    },
    {
      title: '操作用户',
      key: 'user',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.userRealName}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.username}
          </Text>
        </div>
      ),
    },
    {
      title: '操作动作',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      render: (text: string) => (
        <Tag color={getActionColor(text)}>{text}</Tag>
      ),
    },
    {
      title: '资源类型',
      dataIndex: 'resource',
      key: 'resource',
      width: 100,
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
      width: 80,
      render: (text: string) => {
        const colors: { [key: string]: string } = {
          GET: 'blue',
          POST: 'green',
          PUT: 'orange',
          DELETE: 'red',
        };
        return <Tag color={colors[text] || 'default'}>{text}</Tag>;
      },
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '耗时(ms)',
      dataIndex: 'duration',
      key: 'duration',
      width: 80,
      render: (duration: number) => (
        <Text style={{ fontSize: '12px' }}>{duration}</Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            操作日志
          </h1>
        </div>

        <Card>
          {/* 搜索表单 */}
          <Form
            form={searchForm}
            layout="inline"
            style={{ marginBottom: '16px' }}
          >
            <Row gutter={[16, 16]} style={{ width: '100%' }}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="username" label="用户名">
                  <Input placeholder="请输入用户名" allowClear />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="action" label="操作动作">
                  <Select placeholder="请选择操作动作" allowClear>
                    <Option value="创建用户">创建用户</Option>
                    <Option value="更新用户">更新用户</Option>
                    <Option value="删除用户">删除用户</Option>
                    <Option value="登录系统">登录系统</Option>
                    <Option value="登出系统">登出系统</Option>
                    <Option value="查看数据">查看数据</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="resource" label="资源类型">
                  <Select placeholder="请选择资源类型" allowClear>
                    <Option value="users">用户管理</Option>
                    <Option value="patients">患者管理</Option>
                    <Option value="orders">订单管理</Option>
                    <Option value="auth">认证授权</Option>
                    <Option value="system">系统设置</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="status" label="状态">
                  <Select placeholder="请选择状态" allowClear>
                    <Option value="success">成功</Option>
                    <Option value="failed">失败</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="dateRange" label="时间范围">
                  <RangePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder={['开始时间', '结束时间']}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      icon={<SearchOutlined />}
                      onClick={handleSearch}
                    >
                      搜索
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={handleReset}>
                      重置
                    </Button>
                    <Button
                      icon={<ExportOutlined />}
                      onClick={handleExport}
                    >
                      导出
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          {/* 数据表格 */}
          <Table
            columns={columns}
            dataSource={auditLogs}
            rowKey="id"
            loading={loading}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
            }}
            scroll={{ x: 1200 }}
            size="small"
          />
        </Card>

        {/* 详情弹窗 */}
        <Modal
          title="操作日志详情"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              关闭
            </Button>,
          ]}
          width={800}
        >
          {selectedLog && (
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="操作时间" span={2}>
                {selectedLog.createdAt}
              </Descriptions.Item>
              <Descriptions.Item label="操作用户">
                {selectedLog.userRealName} ({selectedLog.username})
              </Descriptions.Item>
              <Descriptions.Item label="用户ID">
                {selectedLog.userId}
              </Descriptions.Item>
              <Descriptions.Item label="操作动作">
                <Tag color={getActionColor(selectedLog.action)}>
                  {selectedLog.action}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="资源类型">
                {selectedLog.resource}
              </Descriptions.Item>
              <Descriptions.Item label="资源ID">
                {selectedLog.resourceId || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="请求方法">
                <Tag
                  color={
                    {
                      GET: 'blue',
                      POST: 'green',
                      PUT: 'orange',
                      DELETE: 'red',
                    }[selectedLog.method] || 'default'
                  }
                >
                  {selectedLog.method}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="请求路径" span={2}>
                <Text code>{selectedLog.path}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="IP地址">
                {selectedLog.ip}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                {getStatusTag(selectedLog.status)}
              </Descriptions.Item>
              <Descriptions.Item label="耗时">
                {selectedLog.duration}ms
              </Descriptions.Item>
              <Descriptions.Item label="错误信息">
                {selectedLog.errorMessage || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="User Agent" span={2}>
                <Text style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                  {selectedLog.userAgent}
                </Text>
              </Descriptions.Item>
              {selectedLog.requestData && (
                <Descriptions.Item label="请求数据" span={2}>
                  <pre style={{ fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
                    {JSON.stringify(selectedLog.requestData, null, 2)}
                  </pre>
                </Descriptions.Item>
              )}
              {selectedLog.responseData && (
                <Descriptions.Item label="响应数据" span={2}>
                  <pre style={{ fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
                    {JSON.stringify(selectedLog.responseData, null, 2)}
                  </pre>
                </Descriptions.Item>
              )}
            </Descriptions>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default AuditLogsPage;