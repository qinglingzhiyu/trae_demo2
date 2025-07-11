'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Tooltip,
  Drawer,
} from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  TeamOutlined,
  UserAddOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import MainLayout from '../../../layouts/MainLayout';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { Search } = Input;

// 定义数据类型
interface Account {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: 'ADMIN' | 'DOCTOR' | 'NURSE';
  status: 'ACTIVE' | 'INACTIVE';
  department?: string;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: number;
    name: string;
  };
}

interface AccountFormData {
  name: string;
  phone: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'DOCTOR' | 'NURSE';
  department?: string;
}

interface Statistics {
  total: number;
  active: number;
  inactive: number;
  byRole: {
    admin: number;
    doctor: number;
    nurse: number;
  };
}

const AccountsManagement: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 获取账号列表
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: pagination.pageSize.toString(),
        ...(searchText && { search: searchText }),
        ...(filterRole && { role: filterRole }),
        ...(filterStatus && { status: filterStatus }),
      });

      const response = await fetch(`http://localhost:4000/api/v1/accounts?${params}`);
      const data = await response.json();

      if (response.ok) {
        setAccounts(data.data);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
        }));
      } else {
        message.error(data.message || '获取账号列表失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/v1/accounts/statistics');
      const data = await response.json();

      if (response.ok) {
        setStatistics(data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchStatistics();
  }, [pagination.current, pagination.pageSize, searchText, filterRole, filterStatus]);

  // 创建账号
  const handleCreate = async (values: AccountFormData) => {
    try {
      const response = await fetch('http://localhost:4000/api/v1/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('账号创建成功');
        setModalVisible(false);
        form.resetFields();
        fetchAccounts();
        fetchStatistics();
      } else {
        message.error(data.message || '创建账号失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    }
  };

  // 更新账号
  const handleUpdate = async (values: AccountFormData) => {
    if (!editingAccount) return;

    try {
      const response = await fetch(`http://localhost:4000/api/v1/accounts/${editingAccount.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('账号更新成功');
        setModalVisible(false);
        setEditingAccount(null);
        form.resetFields();
        fetchAccounts();
      } else {
        message.error(data.message || '更新账号失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    }
  };

  // 切换账号状态
  const handleToggleStatus = async (account: Account) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/accounts/${account.id}/toggle-status`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        message.success(`账号已${account.status === 'ACTIVE' ? '禁用' : '启用'}`);
        fetchAccounts();
        fetchStatistics();
      } else {
        message.error(data.message || '操作失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    }
  };

  // 重置密码
  const handleResetPassword = async (account: Account) => {
    Modal.confirm({
      title: '重置密码',
      content: (
        <div>
          <p>确定要重置用户 <strong>{account.name}</strong> 的密码吗？</p>
          <p style={{ color: '#666', fontSize: '12px' }}>新密码将重置为: 123456</p>
        </div>
      ),
      onOk: async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/v1/accounts/${account.id}/reset-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword: '123456' }),
          });

          if (response.ok) {
            message.success('密码重置成功，新密码为: 123456');
          } else {
            const data = await response.json();
            message.error(data.message || '重置密码失败');
          }
        } catch (error) {
          message.error('网络错误，请稍后重试');
        }
      },
    });
  };

  // 删除账号
  const handleDelete = async (account: Account) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/accounts/${account.id}/delete`, {
        method: 'POST',
      });

      if (response.ok) {
        message.success('账号删除成功');
        fetchAccounts();
        fetchStatistics();
      } else {
        const data = await response.json();
        message.error(data.message || '删除账号失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    }
  };

  // 查看账号详情
  const handleViewDetail = (account: Account) => {
    setSelectedAccount(account);
    setDrawerVisible(true);
  };

  // 表格列定义
  const columns: ColumnsType<Account> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Account) => (
        <Space>
          <UserOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const roleConfig = {
          ADMIN: { color: 'red', text: '管理员' },
          DOCTOR: { color: 'blue', text: '医生' },
          NURSE: { color: 'green', text: '护士' },
        };
        const config = roleConfig[role as keyof typeof roleConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      render: (text: string) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'default'}>
          {status === 'ACTIVE' ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record: Account) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingAccount(record);
                form.setFieldsValue(record);
                setModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title={record.status === 'ACTIVE' ? '禁用' : '启用'}>
            <Button
              type="text"
              icon={record.status === 'ACTIVE' ? <LockOutlined /> : <UnlockOutlined />}
              onClick={() => handleToggleStatus(record)}
            />
          </Tooltip>
          <Tooltip title="重置密码">
            <Button
              type="text"
              icon={<SafetyCertificateOutlined />}
              onClick={() => handleResetPassword(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个账号吗？"
            description="删除后无法恢复，请谨慎操作。"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        {/* 页面标题 */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <UserOutlined style={{ color: '#722ed1' }} />
            后端账号管理
          </h1>
          <p style={{ fontSize: '16px', color: '#666', marginTop: '8px', marginBottom: 0 }}>
            管理后端系统账号、角色权限和用户状态
          </p>
        </div>

        {/* 统计卡片 */}
        {statistics && (
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="总账号数"
                  value={statistics.total}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="正常账号"
                  value={statistics.active}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="禁用账号"
                  value={statistics.inactive}
                  prefix={<LockOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="管理员"
                  value={statistics.byRole.admin}
                  prefix={<SafetyCertificateOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>
        )}

        {/* 操作栏 */}
        <Card style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="搜索姓名、手机号、邮箱或部门"
                allowClear
                enterButton={<SearchOutlined />}
                size="middle"
                onSearch={setSearchText}
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="角色筛选"
                allowClear
                style={{ width: '100%' }}
                value={filterRole}
                onChange={setFilterRole}
              >
                <Option value="ADMIN">管理员</Option>
                <Option value="DOCTOR">医生</Option>
                <Option value="NURSE">护士</Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="状态筛选"
                allowClear
                style={{ width: '100%' }}
                value={filterStatus}
                onChange={setFilterStatus}
              >
                <Option value="ACTIVE">正常</Option>
                <Option value="INACTIVE">禁用</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    fetchAccounts();
                    fetchStatistics();
                  }}
                >
                  刷新
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingAccount(null);
                    form.resetFields();
                    setModalVisible(true);
                  }}
                >
                  新增账号
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 账号列表 */}
        <Card>
          <Table
            columns={columns}
            dataSource={accounts}
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              onChange: (page, pageSize) => {
                setPagination(prev => ({
                  ...prev,
                  current: page,
                  pageSize: pageSize || 10,
                }));
              },
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        {/* 新增/编辑账号弹窗 */}
        <Modal
          title={editingAccount ? '编辑账号' : '新增账号'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingAccount(null);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={editingAccount ? handleUpdate : handleCreate}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="姓名"
                  name="name"
                  rules={[{ required: true, message: '请输入姓名' }]}
                >
                  <Input placeholder="请输入姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="手机号"
                  name="phone"
                  rules={[
                    { required: true, message: '请输入手机号' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
                  ]}
                >
                  <Input placeholder="请输入手机号" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="邮箱"
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入正确的邮箱格式' },
                  ]}
                >
                  <Input placeholder="请输入邮箱" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="角色"
                  name="role"
                  rules={[{ required: true, message: '请选择角色' }]}
                >
                  <Select placeholder="请选择角色">
                    <Option value="ADMIN">管理员</Option>
                    <Option value="DOCTOR">医生</Option>
                    <Option value="NURSE">护士</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="部门"
                  name="department"
                >
                  <Input placeholder="请输入部门（可选）" />
                </Form.Item>
              </Col>
              {!editingAccount && (
                <Col span={12}>
                  <Form.Item
                    label="密码"
                    name="password"
                    rules={[
                      { required: true, message: '请输入密码' },
                      { min: 6, message: '密码至少6位' },
                    ]}
                  >
                    <Input.Password placeholder="请输入密码" />
                  </Form.Item>
                </Col>
              )}
            </Row>
            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button
                  onClick={() => {
                    setModalVisible(false);
                    setEditingAccount(null);
                    form.resetFields();
                  }}
                >
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingAccount ? '更新' : '创建'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* 账号详情抽屉 */}
        <Drawer
          title="账号详情"
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={500}
        >
          {selectedAccount && (
            <div>
              <Card title="基本信息" style={{ marginBottom: '16px' }}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <strong>ID:</strong> {selectedAccount.id}
                  </Col>
                  <Col span={24}>
                    <strong>姓名:</strong> {selectedAccount.name}
                  </Col>
                  <Col span={24}>
                    <strong>手机号:</strong> {selectedAccount.phone}
                  </Col>
                  <Col span={24}>
                    <strong>邮箱:</strong> {selectedAccount.email}
                  </Col>
                  <Col span={24}>
                    <strong>角色:</strong> 
                    <Tag color={selectedAccount.role === 'ADMIN' ? 'red' : selectedAccount.role === 'DOCTOR' ? 'blue' : 'green'} style={{ marginLeft: '8px' }}>
                      {selectedAccount.role === 'ADMIN' ? '管理员' : selectedAccount.role === 'DOCTOR' ? '医生' : '护士'}
                    </Tag>
                  </Col>
                  <Col span={24}>
                    <strong>部门:</strong> {selectedAccount.department || '未设置'}
                  </Col>
                  <Col span={24}>
                    <strong>状态:</strong> 
                    <Tag color={selectedAccount.status === 'ACTIVE' ? 'success' : 'default'} style={{ marginLeft: '8px' }}>
                      {selectedAccount.status === 'ACTIVE' ? '正常' : '禁用'}
                    </Tag>
                  </Col>
                </Row>
              </Card>
              
              <Card title="时间信息">
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <strong>创建时间:</strong> {new Date(selectedAccount.createdAt).toLocaleString()}
                  </Col>
                  <Col span={24}>
                    <strong>更新时间:</strong> {new Date(selectedAccount.updatedAt).toLocaleString()}
                  </Col>
                  {selectedAccount.creator && (
                    <Col span={24}>
                      <strong>创建者:</strong> {selectedAccount.creator.name}
                    </Col>
                  )}
                </Row>
              </Card>
            </div>
          )}
        </Drawer>
      </div>
    </MainLayout>
  );
};

export default AccountsManagement;