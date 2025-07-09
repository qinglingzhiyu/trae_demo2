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
  Tree,
  Tabs,
  message,
  Popconfirm,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { TabPane } = Tabs;

// 角色数据类型
interface Role {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  userCount: number;
  permissions: string[];
  createdAt: string;
}

// 用户数据类型
interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  status: 'active' | 'inactive';
  lastLogin: string;
}

// 权限树数据类型
interface Permission {
  key: string;
  title: string;
  children?: Permission[];
}

const PermissionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [userForm] = Form.useForm();
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

  // 权限树数据
  const permissionTreeData: Permission[] = [
    {
      key: 'dashboard',
      title: '工作台',
      children: [
        { key: 'dashboard:view', title: '查看工作台' },
        { key: 'dashboard:export', title: '导出数据' },
      ],
    },
    {
      key: 'users',
      title: '用户管理',
      children: [
        { key: 'users:view', title: '查看用户' },
        { key: 'users:create', title: '创建用户' },
        { key: 'users:edit', title: '编辑用户' },
        { key: 'users:delete', title: '删除用户' },
      ],
    },
    {
      key: 'patients',
      title: '就诊人管理',
      children: [
        { key: 'patients:view', title: '查看就诊人' },
        { key: 'patients:create', title: '创建就诊人' },
        { key: 'patients:edit', title: '编辑就诊人' },
        { key: 'patients:delete', title: '删除就诊人' },
      ],
    },
    {
      key: 'orders',
      title: '订单管理',
      children: [
        { key: 'orders:view', title: '查看订单' },
        { key: 'orders:create', title: '创建订单' },
        { key: 'orders:edit', title: '编辑订单' },
        { key: 'orders:delete', title: '删除订单' },
        { key: 'orders:approve', title: '审核订单' },
      ],
    },
    {
      key: 'analytics',
      title: '数据分析',
      children: [
        { key: 'analytics:view', title: '查看分析' },
        { key: 'analytics:export', title: '导出报表' },
      ],
    },
    {
      key: 'settings',
      title: '系统设置',
      children: [
        { key: 'settings:permissions', title: '权限管理' },
        { key: 'settings:parameters', title: '系统参数' },
        { key: 'settings:personal', title: '个人设置' },
      ],
    },
  ];

  // 模拟数据
  useEffect(() => {
    setRoles([
      {
        id: '1',
        name: '超级管理员',
        description: '拥有系统所有权限',
        status: 'active',
        userCount: 2,
        permissions: ['dashboard:view', 'users:view', 'users:create', 'users:edit', 'users:delete'],
        createdAt: '2024-01-01',
      },
      {
        id: '2',
        name: '普通管理员',
        description: '拥有基础管理权限',
        status: 'active',
        userCount: 5,
        permissions: ['dashboard:view', 'users:view', 'patients:view'],
        createdAt: '2024-01-02',
      },
      {
        id: '3',
        name: '客服人员',
        description: '负责客户服务相关工作',
        status: 'active',
        userCount: 8,
        permissions: ['dashboard:view', 'patients:view', 'orders:view'],
        createdAt: '2024-01-03',
      },
    ]);

    setUsers([
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        roles: ['超级管理员'],
        status: 'active',
        lastLogin: '2024-01-15 10:30:00',
      },
      {
        id: '2',
        username: 'manager',
        email: 'manager@example.com',
        roles: ['普通管理员'],
        status: 'active',
        lastLogin: '2024-01-15 09:15:00',
      },
      {
        id: '3',
        username: 'service1',
        email: 'service1@example.com',
        roles: ['客服人员'],
        status: 'active',
        lastLogin: '2024-01-15 08:45:00',
      },
    ]);
  }, []);

  // 角色表格列配置
  const roleColumns: ColumnsType<Role> = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (unknown, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditRole(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个角色吗？"
            onConfirm={() => handleDeleteRole(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 用户表格列配置
  const userColumns: ColumnsType<User> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => (
        <>
          {roles.map((role) => (
            <Tag key={role} color="blue">
              {role}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: '操作',
      key: 'action',
      render: (unknown, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 处理角色相关操作
  const handleCreateRole = () => {
    setEditingRole(null);
    setCheckedKeys([]);
    form.resetFields();
    setRoleModalVisible(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setCheckedKeys(role.permissions);
    form.setFieldsValue(role);
    setRoleModalVisible(true);
  };

  const handleDeleteRole = (id: string) => {
    setRoles(roles.filter((role) => role.id !== id));
    message.success('角色删除成功');
  };

  const handleRoleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const roleData = {
        ...values,
        permissions: checkedKeys,
        id: editingRole?.id || Date.now().toString(),
        userCount: editingRole?.userCount || 0,
        createdAt: editingRole?.createdAt || new Date().toISOString().split('T')[0],
      };

      if (editingRole) {
        setRoles(roles.map((role) => (role.id === editingRole.id ? roleData : role)));
        message.success('角色更新成功');
      } else {
        setRoles([...roles, roleData]);
        message.success('角色创建成功');
      }

      setRoleModalVisible(false);
    } catch {
      // 表单验证失败
    }
  };

  // 处理用户相关操作
  const handleCreateUser = () => {
    setEditingUser(null);
    userForm.resetFields();
    setUserModalVisible(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    userForm.setFieldsValue(user);
    setUserModalVisible(true);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
    message.success('用户删除成功');
  };

  const handleUserSubmit = async () => {
    try {
      const values = await userForm.validateFields();
      const userData = {
        ...values,
        id: editingUser?.id || Date.now().toString(),
        lastLogin: editingUser?.lastLogin || new Date().toLocaleString(),
      };

      if (editingUser) {
        setUsers(users.map((user) => (user.id === editingUser.id ? userData : user)));
        message.success('用户更新成功');
      } else {
        setUsers([...users, userData]);
        message.success('用户创建成功');
      }

      setUserModalVisible(false);
    } catch {
      // 表单验证失败
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>权限管理</h1>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={<span><TeamOutlined />角色管理</span>} key="roles">
            <Card>
              <div style={{ marginBottom: '16px' }}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreateRole}
                >
                  新建角色
                </Button>
              </div>
              <Table
                columns={roleColumns}
                dataSource={roles}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                }}
              />
            </Card>
          </TabPane>

          <TabPane tab={<span><UserOutlined />用户角色</span>} key="users">
            <Card>
              <div style={{ marginBottom: '16px' }}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreateUser}
                >
                  分配角色
                </Button>
              </div>
              <Table
                columns={userColumns}
                dataSource={users}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                }}
              />
            </Card>
          </TabPane>
        </Tabs>

        {/* 角色编辑模态框 */}
        <Modal
          title={editingRole ? '编辑角色' : '新建角色'}
          open={roleModalVisible}
          onOk={handleRoleSubmit}
          onCancel={() => setRoleModalVisible(false)}
          width={800}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="角色名称"
              rules={[{ required: true, message: '请输入角色名称' }]}
            >
              <Input placeholder="请输入角色名称" />
            </Form.Item>
            <Form.Item
              name="description"
              label="角色描述"
              rules={[{ required: true, message: '请输入角色描述' }]}
            >
              <Input.TextArea placeholder="请输入角色描述" rows={3} />
            </Form.Item>
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="请选择状态">
                <Option value="active">启用</Option>
                <Option value="inactive">禁用</Option>
              </Select>
            </Form.Item>
            <Form.Item label="权限设置">
              <Tree
                checkable
                checkedKeys={checkedKeys}
                onCheck={(checked) => setCheckedKeys(checked as string[])}
                treeData={permissionTreeData}
                style={{ border: '1px solid #d9d9d9', borderRadius: '6px', padding: '8px' }}
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* 用户角色分配模态框 */}
        <Modal
          title={editingUser ? '编辑用户角色' : '分配用户角色'}
          open={userModalVisible}
          onOk={handleUserSubmit}
          onCancel={() => setUserModalVisible(false)}
        >
          <Form form={userForm} layout="vertical">
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" disabled={!!editingUser} />
            </Form.Item>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item
              name="roles"
              label="角色"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select mode="multiple" placeholder="请选择角色">
                {roles.map((role) => (
                  <Option key={role.id} value={role.name}>
                    {role.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="请选择状态">
                <Option value="active">启用</Option>
                <Option value="inactive">禁用</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default PermissionsPage;