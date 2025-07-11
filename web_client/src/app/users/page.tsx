'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Card,
  Form,
  message,
  Popconfirm,
  Typography,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import MainLayout from '@/layouts/MainLayout';
import { usersApi } from '@/api/users';
import { formatDate, getUserStatusLabel, getUserStatusColor } from '@/utils';
import type { User, QueryParams } from '@/types';

const { Title } = Typography;
const { Option } = Select;

const UsersPage: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [queryParams, setQueryParams] = useState<QueryParams>({
    page: 1,
    limit: 10,
  });
  const [searchForm] = Form.useForm();

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      setLoading(true);
      // 添加角色筛选，只获取C端用户（USER角色），排除后台管理员
      const params = {
        ...queryParams,
        role: queryParams.role || 'USER', // 默认只显示C端用户
      };
      const response = await usersApi.getUsers(params);
      setUsers(response.items);
      setTotal(response.total);
    } catch {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [queryParams]);

  // 搜索处理
  const handleSearch = (values: Record<string, string | number | undefined>) => {
    setQueryParams(prev => ({
      ...prev,
      page: 1,
      ...values,
    }));
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setQueryParams({
      page: 1,
      limit: 10,
    });
  };

  // 删除用户
  const handleDelete = async (id: number) => {
    try {
      await usersApi.deleteUser(id);
      message.success('删除成功');
      fetchUsers();
    } catch {
      message.error('删除失败');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text: string, record: User) => (
        <a onClick={() => router.push(`/users/${record.id}`)}>{text}</a>
      ),
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
        const roleMap: Record<string, { label: string; color: string }> = {
          USER: { label: 'C端用户', color: 'blue' },
        };
        const config = roleMap[role] || { label: role, color: 'default' };
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getUserStatusColor(status)}>
          {getUserStatusLabel(status)}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: unknown, record: User) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/users/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => router.push(`/users/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <div>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              C端用户管理
            </Title>
            <p style={{ margin: '4px 0 0 0', color: '#666' }}>
              管理平台的C端用户，不包括后台管理员账号
            </p>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchUsers}
                loading={loading}
              >
                刷新
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => router.push('/users/create')}
              >
                新增C端用户
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 搜索表单 */}
        <Card style={{ marginBottom: 16 }}>
          <Form
            form={searchForm}
            layout="inline"
            onFinish={handleSearch}
            style={{ width: '100%' }}
          >
            <Form.Item name="username" style={{ marginBottom: 8 }}>
              <Input
                placeholder="用户名"
                allowClear
                style={{ width: 200 }}
              />
            </Form.Item>
            <Form.Item name="email" style={{ marginBottom: 8 }}>
              <Input
                placeholder="邮箱"
                allowClear
                style={{ width: 200 }}
              />
            </Form.Item>
            <Form.Item name="role" style={{ marginBottom: 8 }}>
              <Select
                placeholder="角色"
                allowClear
                style={{ width: 150 }}
              >
                <Option value="USER">C端用户</Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" style={{ marginBottom: 8 }}>
              <Select
                placeholder="状态"
                allowClear
                style={{ width: 120 }}
              >
                <Option value="ACTIVE">激活</Option>
                <Option value="INACTIVE">未激活</Option>
                <Option value="SUSPENDED">暂停</Option>
              </Select>
            </Form.Item>
            <Form.Item style={{ marginBottom: 8 }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  loading={loading}
                >
                  搜索
                </Button>
                <Button onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* 用户表格 */}
        <Card>
          <Table
            dataSource={users}
            columns={columns}
            loading={loading}
            rowKey="id"
            pagination={{
              current: queryParams.page,
              pageSize: queryParams.limit,
              total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              onChange: (page, pageSize) => {
                setQueryParams(prev => ({
                  ...prev,
                  page,
                  limit: pageSize,
                }));
              },
            }}
            scroll={{ x: 800 }}
          />
        </Card>
      </div>
    </MainLayout>
  );
};

export default UsersPage;