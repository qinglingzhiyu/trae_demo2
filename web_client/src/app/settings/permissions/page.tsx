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
  Row,
  Col,
  InputNumber,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SafetyOutlined,
  SettingOutlined,
  UserOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import { permissionAPI } from '@/services/api';
import type { Role, Permission, UserRoleAssignment } from '@/types';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';

const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;
const { TabPane } = Tabs;
const { Text } = Typography;

const PermissionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userRoles, setUserRoles] = useState<UserRoleAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [userRoleModalVisible, setUserRoleModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [editingUserRole, setEditingUserRole] = useState<UserRoleAssignment | null>(null);
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

  // 加载角色数据
  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await permissionAPI.getRoles();
      console.log('角色API响应:', response);
      
      // 处理不同的响应格式
      let roleData: Role[] = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          roleData = response.data as Role[];
        } else if (response.data.items) {
          roleData = response.data.items as Role[];
        } else if (response.data.data) {
          roleData = response.data.data as Role[];
        }
      } else if (Array.isArray(response)) {
        roleData = response as Role[];
      }
      
      console.log('处理后的角色数据:', roleData);
      setRoles(roleData);
    } catch (error: any) {
      console.error('加载角色数据失败:', error);
      if (error.response?.status === 401) {
        message.error('请先登录后再访问权限管理页面');
      } else {
        message.error(`加载角色数据失败: ${error.message || '未知错误'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 加载权限数据
  const loadPermissions = async () => {
    try {
      setLoading(true);
      const response = await permissionAPI.getPermissionTree();
      console.log('权限API响应:', response);
      
      // 处理不同的响应格式
      let permissionData: Permission[] = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          permissionData = response.data as Permission[];
        } else if (response.data.items) {
          permissionData = response.data.items as Permission[];
        } else if (response.data.data) {
          permissionData = response.data.data as Permission[];
        }
      } else if (Array.isArray(response)) {
        permissionData = response as Permission[];
      }
      
      console.log('处理后的权限数据:', permissionData);
      setPermissions(permissionData);
    } catch (error: any) {
      console.error('加载权限数据失败:', error);
      if (error.response?.status === 401) {
        message.error('请先登录后再访问权限管理页面');
      } else {
        message.error(`加载权限数据失败: ${error.message || '未知错误'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 加载用户角色数据
  const loadUserRoles = async () => {
    try {
      setLoading(true);
      // 这里应该调用用户管理API获取用户角色数据
      // const response = await userAPI.getUserRoles();
      // const userData: UserRoleAssignment[] = response.data?.items || [];
      // setUserRoles(userData);
      
      // 暂时使用模拟数据
      const userData: UserRoleAssignment[] = [];
      setUserRoles(userData);
    } catch (error) {
      console.error('加载用户角色数据失败:', error);
      message.error('加载用户角色数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 根据当前标签页加载对应数据
  const loadTabData = (tabKey: string) => {
    switch (tabKey) {
      case 'roles':
        loadRoles();
        break;
      case 'permissions':
        loadPermissions();
        break;
      case 'userRoles':
        loadUserRoles();
        break;
      default:
        break;
    }
  };

  // 初始化数据
  useEffect(() => {
    loadTabData(activeTab);
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
            onConfirm={() => handleDeletePermission()}
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
  const userRoleColumns: ColumnsType<UserRoleAssignment> = [
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
            onConfirm={() => handleDeleteUserRole()}
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

  const handleDeleteRole = async (id: string) => {
    try {
      setLoading(true);
      await permissionAPI.deleteRole(Number(id));
      await loadRoles(); // 重新加载角色列表
      message.success('角色删除成功');
    } catch (error) {
      console.error('删除角色失败:', error);
      message.error('角色删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSubmit = async () => {
    try {
      setLoading(true);
      const values = await roleForm.validateFields();
      
      if (editingRole) {
        // 更新角色
        const updateData = {
          name: values.name,
          code: values.code,
          description: values.description,
        };
        await permissionAPI.updateRole(Number(editingRole.id), updateData);
        message.success('角色更新成功');
      } else {
        // 创建角色
        const createData = {
          name: values.name,
          code: values.code,
          description: values.description,
        };
        await permissionAPI.createRole(createData);
        message.success('角色创建成功');
      }

      await loadRoles(); // 重新加载角色列表
      setRoleModalVisible(false);
    } catch (error) {
      console.error('角色操作失败:', error);
      message.error(editingRole ? '角色更新失败' : '角色创建失败');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigPermissions = async (role: Role) => {
    try {
      setLoading(true);
      setEditingRole(role);
      
      // 从API获取角色的当前权限
      const response = await permissionAPI.getRolePermissions(Number(role.id));
      const rolePermissions = response.data || response;
      setSelectedRolePermissions(rolePermissions.map((p: Permission) => p.id));
      
      setPermissionConfigModalVisible(true);
    } catch (error) {
      console.error('获取角色权限失败:', error);
      message.error('获取角色权限失败');
      // 如果获取失败，仍然打开模态框，但权限为空
      setSelectedRolePermissions([]);
      setPermissionConfigModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // 提交权限配置
  const handlePermissionConfigSubmit = async () => {
    try {
      if (!editingRole) return;
      
      setLoading(true);
      await permissionAPI.assignRolePermissions(Number(editingRole.id), selectedRolePermissions.map(id => Number(id)));
      
      setPermissionConfigModalVisible(false);
      setEditingRole(null);
      setSelectedRolePermissions([]);
      message.success('权限配置成功！');
    } catch (error) {
      console.error('权限配置失败:', error);
      message.error('权限配置失败');
    } finally {
      setLoading(false);
    }
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

  const handleDeletePermission = async () => {
    try {
      setLoading(true);
      // 注意：根据API文档，权限删除可能需要特殊处理，这里暂时注释
      // await permissionAPI.deletePermission(id);
      // await loadPermissions();
      message.warning('权限删除功能暂未开放');
    } catch (error) {
      console.error('删除权限失败:', error);
      message.error('权限删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionSubmit = async () => {
    try {
      setLoading(true);
      await permissionForm.validateFields();
      
      if (editingPermission) {
        // 权限更新功能暂未在API中开放
        message.info('权限更新功能暂未开放，请联系系统管理员');
      } else {
        // 权限创建功能暂未在API中开放
        // 需要添加 code 字段
        // const permissionData = {
        //   name: values.name,
        //   code: values.code || values.name.toLowerCase().replace(/\s+/g, '_'),
        //   description: values.description,
        //   isEnabled: values.enabled,
        //   sortOrder: values.sort
        // };
        message.info('权限创建功能暂未开放，请联系系统管理员');
      }
      
      setPermissionModalVisible(false);
      setEditingPermission(null);
      permissionForm.resetFields();
    } catch (error) {
      console.error('权限操作失败:', error);
      message.error('权限操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 用户角色相关操作
  const handleCreateUserRole = () => {
    setEditingUserRole(null);
    userRoleForm.resetFields();
    setUserRoleModalVisible(true);
  };

  const handleEditUserRole = (userRole: UserRoleAssignment) => {
    setEditingUserRole(userRole);
    userRoleForm.setFieldsValue({
      ...userRole,
      roleIds: userRole.roles.map((role: Role) => role.id),
    });
    setUserRoleModalVisible(true);
  };

  const handleDeleteUserRole = async () => {
    try {
      setLoading(true);
      // 用户角色删除功能需要通过用户管理API实现
      message.warning('用户角色删除功能请在用户管理页面操作');
    } catch (error) {
      console.error('删除用户角色失败:', error);
      message.error('用户角色删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUserRoleSubmit = async () => {
    try {
      setLoading(true);
      await userRoleForm.validateFields();

      if (editingUserRole) {
        // 用户角色更新功能需要通过用户管理API实现
        message.warning('用户角色更新功能请在用户管理页面操作');
      } else {
        // 用户角色创建功能需要通过用户管理API实现
        message.warning('用户角色创建功能请在用户管理页面操作');
      }

      setUserRoleModalVisible(false);
    } catch (error) {
      console.error('用户角色操作失败:', error);
      message.error(editingUserRole ? '用户角色更新失败' : '用户角色创建失败');
    } finally {
      setLoading(false);
    }
  };

  // 搜索过滤
  const getFilteredData = <T extends Record<string, unknown>>(data: T[], searchText: string): T[] => {
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
          onChange={(key) => {
            setActiveTab(key);
            // 切换标签时重新加载对应数据
            loadTabData(key);
          }}
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
                      loadRoles();
                      loadPermissions();
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
              <Table<Role>
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
              <Table<Permission>
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
              <Table<UserRoleAssignment>
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