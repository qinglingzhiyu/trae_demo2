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
  Switch,
  message,
  Popconfirm,
  Tag,
  Tabs,
  Tree,
  Checkbox,
  Row,
  Col,
  Divider,
  InputNumber,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  UserOutlined,
  SafetyOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';

const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;
const { TabPane } = Tabs;
const { Text } = Typography;

interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  enabled: boolean;
  isSystem: boolean;
  sort: number;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  id: string;
  name: string;
  code: string;
  type: 'menu' | 'button' | 'api';
  parentId?: string;
  path?: string;
  icon?: string;
  sort: number;
  enabled: boolean;
  children?: Permission[];
  createdAt: string;
  updatedAt: string;
}

interface UserRole {
  id: string;
  username: string;
  realName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'locked';
  roles: Role[];
  lastLoginAt: string;
  createdAt: string;
}

const PermissionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [userRoleModalVisible, setUserRoleModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [editingUserRole, setEditingUserRole] = useState<UserRole | null>(null);
  const [roleForm] = Form.useForm();
  const [permissionForm] = Form.useForm();
  const [userRoleForm] = Form.useForm();
  const [selectedRolePermissions, setSelectedRolePermissions] = useState<string[]>([]);
  const [permissionConfigModalVisible, setPermissionConfigModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // 转换权限数据为树形结构
  const convertToTreeData = (permissions: Permission[]): DataNode[] => {
    const buildTree = (items: Permission[], parentId?: string): DataNode[] => {
      return items
        .filter(item => item.parentId === parentId)
        .map(item => ({
          key: item.id,
          title: item.name,
          children: buildTree(items, item.id),
        }));
    };
    return buildTree(permissions);
  };

  // 初始化数据
  useEffect(() => {
    // 模拟角色数据
    setRoles([
      {
        id: '1',
        name: '超级管理员',
        code: 'super_admin',
        description: '拥有系统所有权限的超级管理员角色',
        enabled: true,
        isSystem: true,
        sort: 1,
        userCount: 2,
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 10:00:00',
      },
      {
        id: '2',
        name: '系统管理员',
        code: 'admin',
        description: '系统管理员，拥有大部分管理权限',
        enabled: true,
        isSystem: false,
        sort: 2,
        userCount: 5,
        createdAt: '2024-01-02 10:00:00',
        updatedAt: '2024-01-02 10:00:00',
      },
      {
        id: '3',
        name: '业务管理员',
        code: 'business_admin',
        description: '负责业务相关的管理工作',
        enabled: true,
        isSystem: false,
        sort: 3,
        userCount: 8,
        createdAt: '2024-01-03 10:00:00',
        updatedAt: '2024-01-03 10:00:00',
      },
      {
        id: '4',
        name: '普通用户',
        code: 'user',
        description: '普通用户角色，只有基础查看权限',
        enabled: true,
        isSystem: false,
        sort: 4,
        userCount: 20,
        createdAt: '2024-01-04 10:00:00',
        updatedAt: '2024-01-04 10:00:00',
      },
    ]);

    // 模拟权限数据
    setPermissions([
      // 一级菜单
      {
        id: '1',
        name: '工作台',
        code: 'dashboard',
        type: 'menu',
        path: '/dashboard',
        icon: 'DashboardOutlined',
        sort: 1,
        enabled: true,
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 10:00:00',
      },
      {
        id: '2',
        name: '用户管理',
        code: 'users',
        type: 'menu',
        path: '/users',
        icon: 'UserOutlined',
        sort: 2,
        enabled: true,
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 10:00:00',
      },
      {
        id: '3',
        name: '就诊人管理',
        code: 'patients',
        type: 'menu',
        path: '/patients',
        icon: 'TeamOutlined',
        sort: 3,
        enabled: true,
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 10:00:00',
      },
      {
        id: '4',
        name: '订单管理',
        code: 'orders',
        type: 'menu',
        path: '/orders',
        icon: 'ShoppingOutlined',
        sort: 4,
        enabled: true,
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 10:00:00',
      },
      {
        id: '5',
        name: '数据分析',
        code: 'analytics',
        type: 'menu',
        path: '/analytics',
        icon: 'BarChartOutlined',
        sort: 5,
        enabled: true,
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 10:00:00',
      },
      {
        id: '6',
        name: '系统设置',
        code: 'settings',
        type: 'menu',
        path: '/settings',
        icon: 'SettingOutlined',
        sort: 6,
        enabled: true,
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 10:00:00',
      },
      // 二级菜单和按钮权限
      {
        id: '7',
        name: '查看工作台',
        code: 'dashboard:view',
        type: 'button',
        parentId: '1',
        sort: 1,
        enabled: true,
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 10:00:00',
      },
      {
        id: '8',
        name: '查看用户',
        code: 'users:view',
        type: 'button',
        parentId: '2',
        sort: 1,
        enabled: true,
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 10:00:00',
      },
      {
        id: '9',
        name: '创建用户',
        code: 'users:create',
        type: 'button',
        parentId: '2',
        sort: 2,
        enabled: true,
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 10:00:00',
      },
      {
        id: '10',
        name: '编辑用户',
        code: 'users:edit',
        type: 'button',
        parentId: '2',
        sort: 3,
        enabled: true,
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 10:00:00',
      },
      {
        id: '11',
        name: '删除用户',
        code: 'users:delete',
        type: 'button',
        parentId: '2',
        sort: 4,
        enabled: true,
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 10:00:00',
      },
      {
        id: '12',
        name: '权限管理',
        code: 'settings:permissions',
        type: 'menu',
        parentId: '6',
        path: '/settings/permissions',
        sort: 1,
        enabled: true,
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 10:00:00',
      },
      {
        id: '13',
        name: '系统参数',
        code: 'settings:parameters',
        type: 'menu',
        parentId: '6',
        path: '/settings/parameters',
        sort: 2,
        enabled: true,
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 10:00:00',
      },
      {
        id: '14',
        name: '字典管理',
        code: 'settings:dictionary',
        type: 'menu',
        parentId: '6',
        path: '/settings/dictionary',
        sort: 3,
        enabled: true,
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 10:00:00',
      },
      {
        id: '15',
        name: '操作日志',
        code: 'settings:audit-logs',
        type: 'menu',
        parentId: '6',
        path: '/settings/audit-logs',
        sort: 4,
        enabled: true,
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 10:00:00',
      },
      {
        id: '16',
        name: '消息通知',
        code: 'settings:notifications',
        type: 'menu',
        parentId: '6',
        path: '/settings/notifications',
        sort: 5,
        enabled: true,
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 10:00:00',
      },
    ]);

    // 模拟用户角色数据
    setUserRoles([
      {
        id: '1',
        username: 'admin',
        realName: '系统管理员',
        email: 'admin@example.com',
        phone: '13800138000',
        status: 'active',
        roles: [
          {
            id: '1',
            name: '超级管理员',
            code: 'super_admin',
            description: '拥有系统所有权限的超级管理员角色',
            enabled: true,
            isSystem: true,
            sort: 1,
            userCount: 2,
            createdAt: '2024-01-01 10:00:00',
            updatedAt: '2024-01-01 10:00:00',
          },
        ],
        lastLoginAt: '2024-01-15 10:30:00',
        createdAt: '2024-01-01 10:00:00',
      },
      {
        id: '2',
        username: 'manager',
        realName: '业务经理',
        email: 'manager@example.com',
        phone: '13800138001',
        status: 'active',
        roles: [
          {
            id: '2',
            name: '系统管理员',
            code: 'admin',
            description: '系统管理员，拥有大部分管理权限',
            enabled: true,
            isSystem: false,
            sort: 2,
            userCount: 5,
            createdAt: '2024-01-02 10:00:00',
            updatedAt: '2024-01-02 10:00:00',
          },
        ],
        lastLoginAt: '2024-01-15 09:15:00',
        createdAt: '2024-01-02 10:00:00',
      },
      {
        id: '3',
        username: 'service1',
        realName: '客服专员',
        email: 'service1@example.com',
        phone: '13800138002',
        status: 'active',
        roles: [
          {
            id: '3',
            name: '业务管理员',
            code: 'business_admin',
            description: '负责业务相关的管理工作',
            enabled: true,
            isSystem: false,
            sort: 3,
            userCount: 8,
            createdAt: '2024-01-03 10:00:00',
            updatedAt: '2024-01-03 10:00:00',
          },
        ],
        lastLoginAt: '2024-01-15 08:45:00',
        createdAt: '2024-01-03 10:00:00',
      },
    ]);
  }, []);

  // 角色表格列配置
  const roleColumns: ColumnsType<Role> = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 80,
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '系统角色',
      dataIndex: 'isSystem',
      key: 'isSystem',
      width: 100,
      render: (isSystem: boolean) => (
        <Tag color={isSystem ? 'blue' : 'default'}>
          {isSystem ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
      width: 100,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditRole(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<SafetyOutlined />}
            onClick={() => handleConfigPermissions(record)}
          >
            权限
          </Button>
          {!record.isSystem && (
            <Popconfirm
              title="确定要删除这个角色吗？"
              description="删除后不可恢复，请谨慎操作！"
              onConfirm={() => handleDeleteRole(record.id)}
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
          )}
        </Space>
      ),
    },
  ];

  // 权限表格列配置
  const permissionColumns: ColumnsType<Permission> = [
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '权限编码',
      dataIndex: 'code',
      key: 'code',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const typeMap = {
          menu: { color: 'blue', text: '菜单' },
          button: { color: 'green', text: '按钮' },
          api: { color: 'orange', text: 'API' },
        };
        const config = typeMap[type as keyof typeof typeMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      width: 200,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 80,
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditPermission(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个权限吗？"
            description="删除后不可恢复，请谨慎操作！"
            onConfirm={() => handleDeletePermission(record.id)}
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

  // 用户角色表格列配置
  const userRoleColumns: ColumnsType<UserRole> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
      key: 'realName',
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      ellipsis: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      width: 200,
      render: (roles: Role[]) => (
        <>
          {roles.map((role) => (
            <Tag key={role.id} color="blue">
              {role.name}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => {
        const statusMap = {
          active: { color: 'green', text: '正常' },
          inactive: { color: 'red', text: '禁用' },
          locked: { color: 'orange', text: '锁定' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditUserRole(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户的角色分配吗？"
            description="删除后用户将失去所有权限！"
            onConfirm={() => handleDeleteUserRole(record.id)}
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

  // 角色相关操作
  const handleCreateRole = () => {
    setEditingRole(null);
    roleForm.resetFields();
    setRoleModalVisible(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    roleForm.setFieldsValue({
      ...role,
      enabled: role.enabled,
    });
    setRoleModalVisible(true);
  };

  const handleDeleteRole = (id: string) => {
    setRoles(roles.filter((role) => role.id !== id));
    message.success('角色删除成功');
  };

  const handleRoleSubmit = async () => {
    try {
      const values = await roleForm.validateFields();
      const now = new Date().toLocaleString();
      const roleData: Role = {
        ...values,
        id: editingRole?.id || Date.now().toString(),
        userCount: editingRole?.userCount || 0,
        createdAt: editingRole?.createdAt || now,
        updatedAt: now,
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

  const handleConfigPermissions = (role: Role) => {
    setEditingRole(role);
    // TODO: 获取角色的权限列表
    setSelectedRolePermissions([]);
    setPermissionConfigModalVisible(true);
  };

  // 提交权限配置
  const handlePermissionConfigSubmit = () => {
    if (!editingRole) return;
    
    const updatedRoles = roles.map(role => {
      if (role.id === editingRole.id) {
        return {
          ...role,
          permissions: selectedRolePermissions,
          updatedAt: new Date().toLocaleString()
        };
      }
      return role;
    });
    
    setRoles(updatedRoles);
    setPermissionConfigModalVisible(false);
    setEditingRole(null);
    setSelectedRolePermissions([]);
    message.success('权限配置成功！');
  };

  // 权限相关操作
  const handleCreatePermission = () => {
    setEditingPermission(null);
    permissionForm.resetFields();
    setPermissionModalVisible(true);
  };

  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission);
    permissionForm.setFieldsValue(permission);
    setPermissionModalVisible(true);
  };

  const handleDeletePermission = (id: string) => {
    setPermissions(permissions.filter((permission) => permission.id !== id));
    message.success('权限删除成功');
  };

  const handlePermissionSubmit = async () => {
    try {
      const values = await permissionForm.validateFields();
      const now = new Date().toLocaleString();
      const permissionData: Permission = {
        ...values,
        id: editingPermission?.id || Date.now().toString(),
        createdAt: editingPermission?.createdAt || now,
        updatedAt: now,
      };

      if (editingPermission) {
        setPermissions(permissions.map((permission) => 
          permission.id === editingPermission.id ? permissionData : permission
        ));
        message.success('权限更新成功');
      } else {
        setPermissions([...permissions, permissionData]);
        message.success('权限创建成功');
      }

      setPermissionModalVisible(false);
    } catch {
      // 表单验证失败
    }
  };

  // 用户角色相关操作
  const handleCreateUserRole = () => {
    setEditingUserRole(null);
    userRoleForm.resetFields();
    setUserRoleModalVisible(true);
  };

  const handleEditUserRole = (userRole: UserRole) => {
    setEditingUserRole(userRole);
    userRoleForm.setFieldsValue({
      ...userRole,
      roleIds: userRole.roles.map(role => role.id),
    });
    setUserRoleModalVisible(true);
  };

  const handleDeleteUserRole = (id: string) => {
    setUserRoles(userRoles.filter((userRole) => userRole.id !== id));
    message.success('用户角色删除成功');
  };

  const handleUserRoleSubmit = async () => {
    try {
      const values = await userRoleForm.validateFields();
      const selectedRoles = roles.filter(role => values.roleIds.includes(role.id));
      const now = new Date().toLocaleString();
      
      const userRoleData: UserRole = {
        ...values,
        id: editingUserRole?.id || Date.now().toString(),
        roles: selectedRoles,
        lastLoginAt: editingUserRole?.lastLoginAt || '',
        createdAt: editingUserRole?.createdAt || now,
      };

      if (editingUserRole) {
        setUserRoles(userRoles.map((userRole) => 
          userRole.id === editingUserRole.id ? userRoleData : userRole
        ));
        message.success('用户角色更新成功');
      } else {
        setUserRoles([...userRoles, userRoleData]);
        message.success('用户角色创建成功');
      }

      setUserRoleModalVisible(false);
    } catch {
      // 表单验证失败
    }
  };

  // 搜索过滤
  const getFilteredData = (data: any[], searchText: string) => {
    if (!searchText) return data;
    return data.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        {/* 页面标题 */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#1f2937' }}>
            权限管理
          </h1>
          <p style={{ color: '#6b7280', margin: '8px 0 0 0' }}>
            管理系统角色、权限和用户角色分配
          </p>
        </div>

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          size="large"
          tabBarStyle={{ marginBottom: '24px' }}
        >
          {/* 角色管理 */}
          <TabPane 
            tab={
              <span>
                <SafetyOutlined />
                角色管理
              </span>
            } 
            key="roles"
          >
            <Card>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px' 
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Search
                    placeholder="搜索角色名称、编码或描述"
                    allowClear
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      setSearchText('');
                      setLoading(true);
                      setTimeout(() => setLoading(false), 500);
                    }}
                  >
                    刷新
                  </Button>
                </div>
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
                dataSource={getFilteredData(roles, searchText)}
                rowKey="id"
                loading={loading}
                scroll={{ x: 1200 }}
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

          {/* 权限管理 */}
          <TabPane 
            tab={
              <span>
                <SettingOutlined />
                权限管理
              </span>
            } 
            key="permissions"
          >
            <Card>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px' 
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Search
                    placeholder="搜索权限名称、编码或路径"
                    allowClear
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <Select
                    placeholder="权限类型"
                    allowClear
                    style={{ width: 120 }}
                  >
                    <Option value="menu">菜单</Option>
                    <Option value="button">按钮</Option>
                    <Option value="api">API</Option>
                  </Select>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      setSearchText('');
                      setLoading(true);
                      setTimeout(() => setLoading(false), 500);
                    }}
                  >
                    刷新
                  </Button>
                </div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreatePermission}
                >
                  新建权限
                </Button>
              </div>
              <Table
                columns={permissionColumns}
                dataSource={getFilteredData(permissions, searchText)}
                rowKey="id"
                loading={loading}
                scroll={{ x: 1200 }}
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

          {/* 用户角色 */}
          <TabPane 
            tab={
              <span>
                <UserOutlined />
                用户角色
              </span>
            } 
            key="userRoles"
          >
            <Card>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px' 
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Search
                    placeholder="搜索用户名、姓名或邮箱"
                    allowClear
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <Select
                    placeholder="用户状态"
                    allowClear
                    style={{ width: 120 }}
                  >
                    <Option value="active">正常</Option>
                    <Option value="inactive">禁用</Option>
                    <Option value="locked">锁定</Option>
                  </Select>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      setSearchText('');
                      setLoading(true);
                      setTimeout(() => setLoading(false), 500);
                    }}
                  >
                    刷新
                  </Button>
                </div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreateUserRole}
                >
                  分配角色
                </Button>
              </div>
              <Table
                columns={userRoleColumns}
                dataSource={getFilteredData(userRoles, searchText)}
                rowKey="id"
                loading={loading}
                scroll={{ x: 1200 }}
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
          width={600}
          destroyOnClose
        >
          <Form form={roleForm} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="角色名称"
                  rules={[{ required: true, message: '请输入角色名称' }]}
                >
                  <Input placeholder="请输入角色名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="code"
                  label="角色编码"
                  rules={[{ required: true, message: '请输入角色编码' }]}
                >
                  <Input placeholder="请输入角色编码" disabled={!!editingRole} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="description"
              label="角色描述"
              rules={[{ required: true, message: '请输入角色描述' }]}
            >
              <TextArea placeholder="请输入角色描述" rows={3} />
            </Form.Item>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="enabled"
                  label="启用状态"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="isSystem"
                  label="系统角色"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Switch checkedChildren="是" unCheckedChildren="否" disabled={!!editingRole} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="sort"
                  label="排序"
                  rules={[{ required: true, message: '请输入排序' }]}
                  initialValue={1}
                >
                  <InputNumber min={1} max={999} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>

        {/* 权限编辑模态框 */}
        <Modal
          title={editingPermission ? '编辑权限' : '新建权限'}
          open={permissionModalVisible}
          onOk={handlePermissionSubmit}
          onCancel={() => setPermissionModalVisible(false)}
          width={600}
          destroyOnClose
        >
          <Form form={permissionForm} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="权限名称"
                  rules={[{ required: true, message: '请输入权限名称' }]}
                >
                  <Input placeholder="请输入权限名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="code"
                  label="权限编码"
                  rules={[{ required: true, message: '请输入权限编码' }]}
                >
                  <Input placeholder="请输入权限编码" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="权限类型"
                  rules={[{ required: true, message: '请选择权限类型' }]}
                >
                  <Select placeholder="请选择权限类型">
                    <Option value="menu">菜单</Option>
                    <Option value="button">按钮</Option>
                    <Option value="api">API</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="parentId"
                  label="父级权限"
                >
                  <Select placeholder="请选择父级权限" allowClear>
                    {permissions
                      .filter(p => p.type === 'menu' && !p.parentId)
                      .map(permission => (
                        <Option key={permission.id} value={permission.id}>
                          {permission.name}
                        </Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="path"
              label="权限路径"
            >
              <Input placeholder="请输入权限路径" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="icon"
                  label="图标"
                >
                  <Input placeholder="请输入图标" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="sort"
                  label="排序"
                  rules={[{ required: true, message: '请输入排序' }]}
                  initialValue={1}
                >
                  <InputNumber min={1} max={999} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="enabled"
                  label="启用状态"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>

        {/* 用户角色分配模态框 */}
        <Modal
          title={editingUserRole ? '编辑用户角色' : '分配用户角色'}
          open={userRoleModalVisible}
          onOk={handleUserRoleSubmit}
          onCancel={() => setUserRoleModalVisible(false)}
          width={600}
          destroyOnClose
        >
          <Form form={userRoleForm} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="username"
                  label="用户名"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input placeholder="请输入用户名" disabled={!!editingUserRole} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="realName"
                  label="真实姓名"
                  rules={[{ required: true, message: '请输入真实姓名' }]}
                >
                  <Input placeholder="请输入真实姓名" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
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
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="手机号"
                  rules={[
                    { required: true, message: '请输入手机号' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
                  ]}
                >
                  <Input placeholder="请输入手机号" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="roleIds"
              label="分配角色"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select mode="multiple" placeholder="请选择角色">
                {roles.map((role) => (
                  <Option key={role.id} value={role.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{role.name}</span>
                      <Tag color={role.isSystem ? 'blue' : 'default'}>
                        {role.isSystem ? '系统' : '自定义'}
                      </Tag>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="用户状态"
              rules={[{ required: true, message: '请选择状态' }]}
              initialValue="active"
            >
              <Select placeholder="请选择状态">
                <Option value="active">正常</Option>
                <Option value="inactive">禁用</Option>
                <Option value="locked">锁定</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>

      {/* 权限配置模态框 */}
        <Modal
          title={`配置角色权限 - ${editingRole?.name}`}
          open={permissionConfigModalVisible}
          onOk={handlePermissionConfigSubmit}
          onCancel={() => setPermissionConfigModalVisible(false)}
          width={800}
          destroyOnClose
        >
          <div style={{ marginBottom: 16 }}>
            <Text type="secondary">
              为角色 <Text strong>{editingRole?.name}</Text> 配置权限，选中的权限将授予该角色。
            </Text>
          </div>
          <Tree
            checkable
            checkedKeys={selectedRolePermissions}
            onCheck={(checked) => setSelectedRolePermissions(checked as string[])}
            treeData={convertToTreeData(permissions)}
            style={{ 
              border: '1px solid #d9d9d9', 
              borderRadius: '6px', 
              padding: '16px',
              maxHeight: '400px',
              overflow: 'auto'
            }}
            defaultExpandAll
          />
        </Modal>
      </MainLayout>
    );
  };

  export default PermissionsPage;