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
  Row,
  Col,
  Divider,
  Tree,
  InputNumber,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  FolderOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';

const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;

interface DictionaryType {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'active' | 'inactive';
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

interface DictionaryItem {
  id: string;
  typeId: string;
  label: string;
  value: string;
  sort: number;
  status: 'active' | 'inactive';
  description: string;
  parentId?: string;
  children?: DictionaryItem[];
  createdAt: string;
  updatedAt: string;
}

const DictionaryPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [editingType, setEditingType] = useState<DictionaryType | null>(null);
  const [editingItem, setEditingItem] = useState<DictionaryItem | null>(null);
  const [typeForm] = Form.useForm();
  const [itemForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [itemSearchText, setItemSearchText] = useState('');

  // 模拟数据
  const [dictionaryTypes, setDictionaryTypes] = useState<DictionaryType[]>([
    {
      id: '1',
      name: '用户状态',
      code: 'user_status',
      description: '用户账户状态分类',
      status: 'active',
      itemCount: 3,
      createdAt: '2024-01-15 10:30:00',
      updatedAt: '2024-01-15 10:30:00',
    },
    {
      id: '2',
      name: '订单状态',
      code: 'order_status',
      description: '订单处理状态分类',
      status: 'active',
      itemCount: 5,
      createdAt: '2024-01-15 11:00:00',
      updatedAt: '2024-01-15 11:00:00',
    },
    {
      id: '3',
      name: '性别',
      code: 'gender',
      description: '性别分类',
      status: 'active',
      itemCount: 3,
      createdAt: '2024-01-15 11:30:00',
      updatedAt: '2024-01-15 11:30:00',
    },
    {
      id: '4',
      name: '地区分类',
      code: 'region',
      description: '地区层级分类',
      status: 'active',
      itemCount: 12,
      createdAt: '2024-01-15 12:00:00',
      updatedAt: '2024-01-15 12:00:00',
    },
  ]);

  const [dictionaryItems, setDictionaryItems] = useState<DictionaryItem[]>([
    // 用户状态
    {
      id: '1',
      typeId: '1',
      label: '正常',
      value: 'active',
      sort: 1,
      status: 'active',
      description: '用户状态正常',
      createdAt: '2024-01-15 10:30:00',
      updatedAt: '2024-01-15 10:30:00',
    },
    {
      id: '2',
      typeId: '1',
      label: '禁用',
      value: 'disabled',
      sort: 2,
      status: 'active',
      description: '用户被禁用',
      createdAt: '2024-01-15 10:30:00',
      updatedAt: '2024-01-15 10:30:00',
    },
    {
      id: '3',
      typeId: '1',
      label: '待审核',
      value: 'pending',
      sort: 3,
      status: 'active',
      description: '用户待审核',
      createdAt: '2024-01-15 10:30:00',
      updatedAt: '2024-01-15 10:30:00',
    },
    // 订单状态
    {
      id: '4',
      typeId: '2',
      label: '待支付',
      value: 'pending_payment',
      sort: 1,
      status: 'active',
      description: '订单待支付',
      createdAt: '2024-01-15 11:00:00',
      updatedAt: '2024-01-15 11:00:00',
    },
    {
      id: '5',
      typeId: '2',
      label: '已支付',
      value: 'paid',
      sort: 2,
      status: 'active',
      description: '订单已支付',
      createdAt: '2024-01-15 11:00:00',
      updatedAt: '2024-01-15 11:00:00',
    },
    {
      id: '6',
      typeId: '2',
      label: '处理中',
      value: 'processing',
      sort: 3,
      status: 'active',
      description: '订单处理中',
      createdAt: '2024-01-15 11:00:00',
      updatedAt: '2024-01-15 11:00:00',
    },
    {
      id: '7',
      typeId: '2',
      label: '已完成',
      value: 'completed',
      sort: 4,
      status: 'active',
      description: '订单已完成',
      createdAt: '2024-01-15 11:00:00',
      updatedAt: '2024-01-15 11:00:00',
    },
    {
      id: '8',
      typeId: '2',
      label: '已取消',
      value: 'cancelled',
      sort: 5,
      status: 'active',
      description: '订单已取消',
      createdAt: '2024-01-15 11:00:00',
      updatedAt: '2024-01-15 11:00:00',
    },
    // 性别
    {
      id: '9',
      typeId: '3',
      label: '男',
      value: 'male',
      sort: 1,
      status: 'active',
      description: '男性',
      createdAt: '2024-01-15 11:30:00',
      updatedAt: '2024-01-15 11:30:00',
    },
    {
      id: '10',
      typeId: '3',
      label: '女',
      value: 'female',
      sort: 2,
      status: 'active',
      description: '女性',
      createdAt: '2024-01-15 11:30:00',
      updatedAt: '2024-01-15 11:30:00',
    },
    {
      id: '11',
      typeId: '3',
      label: '未知',
      value: 'unknown',
      sort: 3,
      status: 'active',
      description: '性别未知',
      createdAt: '2024-01-15 11:30:00',
      updatedAt: '2024-01-15 11:30:00',
    },
  ]);

  // 字典类型表格列
  const typeColumns: ColumnsType<DictionaryType> = [
    {
      title: '字典名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => setSelectedType(record.id)}
          style={{ padding: 0, height: 'auto' }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: '字典编码',
      dataIndex: 'code',
      key: 'code',
      render: (text) => <code>{text}</code>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '字典项数量',
      dataIndex: 'itemCount',
      key: 'itemCount',
      align: 'center',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditType(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个字典类型吗？"
            description="删除后将同时删除所有相关字典项，此操作不可恢复。"
            onConfirm={() => handleDeleteType(record.id)}
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

  // 字典项表格列
  const itemColumns: ColumnsType<DictionaryItem> = [
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      align: 'center',
    },
    {
      title: '标签',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      render: (text) => <code>{text}</code>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditItem(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个字典项吗？"
            onConfirm={() => handleDeleteItem(record.id)}
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

  // 处理字典类型操作
  const handleAddType = () => {
    setEditingType(null);
    typeForm.resetFields();
    setTypeModalVisible(true);
  };

  const handleEditType = (type: DictionaryType) => {
    setEditingType(type);
    typeForm.setFieldsValue(type);
    setTypeModalVisible(true);
  };

  const handleDeleteType = async (id: string) => {
    try {
      setLoading(true);
      // 这里应该调用API删除字典类型
      setDictionaryTypes(prev => prev.filter(item => item.id !== id));
      setDictionaryItems(prev => prev.filter(item => item.typeId !== id));
      if (selectedType === id) {
        setSelectedType(null);
      }
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveType = async () => {
    try {
      const values = await typeForm.validateFields();
      setLoading(true);
      
      if (editingType) {
        // 编辑
        setDictionaryTypes(prev => 
          prev.map(item => 
            item.id === editingType.id 
              ? { ...item, ...values, updatedAt: new Date().toLocaleString() }
              : item
          )
        );
        message.success('更新成功');
      } else {
        // 新增
        const newType: DictionaryType = {
          id: Date.now().toString(),
          ...values,
          itemCount: 0,
          createdAt: new Date().toLocaleString(),
          updatedAt: new Date().toLocaleString(),
        };
        setDictionaryTypes(prev => [...prev, newType]);
        message.success('添加成功');
      }
      
      setTypeModalVisible(false);
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理字典项操作
  const handleAddItem = () => {
    if (!selectedType) {
      message.warning('请先选择字典类型');
      return;
    }
    setEditingItem(null);
    itemForm.resetFields();
    itemForm.setFieldsValue({ typeId: selectedType });
    setItemModalVisible(true);
  };

  const handleEditItem = (item: DictionaryItem) => {
    setEditingItem(item);
    itemForm.setFieldsValue(item);
    setItemModalVisible(true);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      setLoading(true);
      setDictionaryItems(prev => prev.filter(item => item.id !== id));
      // 更新字典类型的项目数量
      const item = dictionaryItems.find(item => item.id === id);
      if (item) {
        setDictionaryTypes(prev => 
          prev.map(type => 
            type.id === item.typeId 
              ? { ...type, itemCount: type.itemCount - 1 }
              : type
          )
        );
      }
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async () => {
    try {
      const values = await itemForm.validateFields();
      setLoading(true);
      
      if (editingItem) {
        // 编辑
        setDictionaryItems(prev => 
          prev.map(item => 
            item.id === editingItem.id 
              ? { ...item, ...values, updatedAt: new Date().toLocaleString() }
              : item
          )
        );
        message.success('更新成功');
      } else {
        // 新增
        const newItem: DictionaryItem = {
          id: Date.now().toString(),
          ...values,
          createdAt: new Date().toLocaleString(),
          updatedAt: new Date().toLocaleString(),
        };
        setDictionaryItems(prev => [...prev, newItem]);
        // 更新字典类型的项目数量
        setDictionaryTypes(prev => 
          prev.map(type => 
            type.id === values.typeId 
              ? { ...type, itemCount: type.itemCount + 1 }
              : type
          )
        );
        message.success('添加成功');
      }
      
      setItemModalVisible(false);
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  // 过滤数据
  const filteredTypes = dictionaryTypes.filter(type => 
    type.name.toLowerCase().includes(searchText.toLowerCase()) ||
    type.code.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredItems = dictionaryItems.filter(item => {
    if (!selectedType) return false;
    const matchesType = item.typeId === selectedType;
    const matchesSearch = item.label.toLowerCase().includes(itemSearchText.toLowerCase()) ||
                         item.value.toLowerCase().includes(itemSearchText.toLowerCase());
    return matchesType && matchesSearch;
  });

  const selectedTypeName = dictionaryTypes.find(type => type.id === selectedType)?.name;

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>字典管理</h1>
        </div>

        <Row gutter={24}>
          {/* 左侧：字典类型 */}
          <Col xs={24} lg={10}>
            <Card
              title="字典类型"
              extra={
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddType}
                  >
                    新增类型
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={() => setLoading(false)}>
                    刷新
                  </Button>
                </Space>
              }
            >
              <div style={{ marginBottom: 16 }}>
                <Search
                  placeholder="搜索字典类型"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              
              <Table
                columns={typeColumns}
                dataSource={filteredTypes}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条`,
                }}
                rowSelection={{
                  type: 'radio',
                  selectedRowKeys: selectedType ? [selectedType] : [],
                  onChange: (selectedRowKeys) => {
                    setSelectedType(selectedRowKeys[0] as string || null);
                  },
                }}
                size="small"
              />
            </Card>
          </Col>

          {/* 右侧：字典项 */}
          <Col xs={24} lg={14}>
            <Card
              title={selectedTypeName ? `字典项 - ${selectedTypeName}` : '字典项'}
              extra={
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddItem}
                    disabled={!selectedType}
                  >
                    新增字典项
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={() => setLoading(false)}>
                    刷新
                  </Button>
                </Space>
              }
            >
              {selectedType ? (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <Search
                      placeholder="搜索字典项"
                      value={itemSearchText}
                      onChange={(e) => setItemSearchText(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                  
                  <Table
                    columns={itemColumns}
                    dataSource={filteredItems}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total) => `共 ${total} 条`,
                    }}
                    size="small"
                  />
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
                  <FolderOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                  <div>请先选择字典类型</div>
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* 字典类型编辑模态框 */}
        <Modal
          title={editingType ? '编辑字典类型' : '新增字典类型'}
          open={typeModalVisible}
          onOk={handleSaveType}
          onCancel={() => setTypeModalVisible(false)}
          confirmLoading={loading}
          width={600}
        >
          <Form form={typeForm} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="字典名称"
                  rules={[{ required: true, message: '请输入字典名称' }]}
                >
                  <Input placeholder="请输入字典名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="code"
                  label="字典编码"
                  rules={[
                    { required: true, message: '请输入字典编码' },
                    { pattern: /^[a-z_]+$/, message: '编码只能包含小写字母和下划线' },
                  ]}
                >
                  <Input placeholder="请输入字典编码" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="description"
              label="描述"
            >
              <TextArea rows={3} placeholder="请输入描述" />
            </Form.Item>
            <Form.Item
              name="status"
              label="状态"
              initialValue="active"
            >
              <Select>
                <Option value="active">启用</Option>
                <Option value="inactive">禁用</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* 字典项编辑模态框 */}
        <Modal
          title={editingItem ? '编辑字典项' : '新增字典项'}
          open={itemModalVisible}
          onOk={handleSaveItem}
          onCancel={() => setItemModalVisible(false)}
          confirmLoading={loading}
          width={600}
        >
          <Form form={itemForm} layout="vertical">
            <Form.Item name="typeId" hidden>
              <Input />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="label"
                  label="标签"
                  rules={[{ required: true, message: '请输入标签' }]}
                >
                  <Input placeholder="请输入标签" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="value"
                  label="值"
                  rules={[{ required: true, message: '请输入值' }]}
                >
                  <Input placeholder="请输入值" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="sort"
                  label="排序"
                  initialValue={1}
                  rules={[{ required: true, message: '请输入排序' }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="状态"
                  initialValue="active"
                >
                  <Select>
                    <Option value="active">启用</Option>
                    <Option value="inactive">禁用</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="description"
              label="描述"
            >
              <TextArea rows={3} placeholder="请输入描述" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default DictionaryPage;