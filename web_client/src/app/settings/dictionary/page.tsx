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
  Spin,
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

import { dictionariesApi, DictionaryType as ApiDictionaryType, DictionaryItem as ApiDictionaryItem } from '@/api/dictionaries';

interface DictionaryType {
  id: number;
  name: string;
  code: string;
  description: string;
  status: boolean;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

interface DictionaryItem {
  id: number;
  typeId: number;
  label: string;
  value: string;
  sort: number;
  status: boolean;
  description: string;
  parentId?: number;
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

  const [dictionaryTypes, setDictionaryTypes] = useState<DictionaryType[]>([]);
  const [dictionaryItems, setDictionaryItems] = useState<DictionaryItem[]>([]);
  const [typesLoading, setTypesLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  
  // 加载字典类型列表
  const loadDictionaryTypes = async () => {
    try {
      setTypesLoading(true);
      const response = await dictionariesApi.getAllDictionaryTypes();
      const types = response.map((type: ApiDictionaryType) => ({
        id: type.id,
        name: type.name,
        code: type.code,
        description: type.description || '',
        status: type.isActive !== undefined ? type.isActive : true,
        itemCount: type.items?.length || 0,
        createdAt: new Date(type.createdAt).toLocaleString(),
        updatedAt: new Date(type.updatedAt).toLocaleString(),
      }));
      setDictionaryTypes(types);
    } catch (error) {
      console.error('加载字典类型失败:', error);
      message.error('加载字典类型失败');
    } finally {
      setTypesLoading(false);
    }
  };

  // 加载字典项列表
  const loadDictionaryItems = async (typeCode: string) => {
    if (!typeCode) return;
    
    try {
      setItemsLoading(true);
      const response = await dictionariesApi.getDictionaryItemsByType(typeCode);
      const items = response.map((item: ApiDictionaryItem) => ({
        id: item.id,
        typeId: item.typeId,
        label: item.label,
        value: item.value,
        sort: item.sort || 0,
        status: true, // 后端API中没有status字段，默认为启用
        description: item.description || '',
        createdAt: new Date(item.createdAt).toLocaleString(),
        updatedAt: new Date(item.updatedAt).toLocaleString(),
      }));
      setDictionaryItems(items);
    } catch (error) {
      console.error('加载字典项失败:', error);
      message.error('加载字典项失败');
    } finally {
      setItemsLoading(false);
    }
  };
  
  // 初始加载
  useEffect(() => {
    loadDictionaryTypes();
  }, []);
  
  // 当选择的字典类型变化时，加载对应的字典项
  useEffect(() => {
    if (selectedType) {
      const selectedTypeObj = dictionaryTypes.find(type => type.id === Number(selectedType));
      if (selectedTypeObj) {
        loadDictionaryItems(selectedTypeObj.code);
      }
    } else {
      setDictionaryItems([]);
    }
  }, [selectedType, dictionaryTypes]);

  // 字典类型表格列
  const typeColumns: ColumnsType<DictionaryType> = [
    {
      title: '字典名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => setSelectedType(record.id.toString())}
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
        <Tag color={status ? 'green' : 'red'}>
          {status ? '启用' : '禁用'}
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
        <Tag color={status ? 'green' : 'red'}>
          {status ? '启用' : '禁用'}
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

  const handleDeleteType = async (id: number) => {
    try {
      setLoading(true);
      await dictionariesApi.deleteDictionaryType(id);
      
      // 更新本地状态
      setDictionaryTypes(prev => prev.filter(item => item.id !== id));
      setDictionaryItems(prev => prev.filter(item => item.typeId !== id));
      if (selectedType === id.toString()) {
        setSelectedType(null);
      }
      message.success('删除成功');
    } catch (error) {
      console.error('删除字典类型失败:', error);
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
        const updateData = {
          name: values.name,
          description: values.description,
        };
        
        await dictionariesApi.updateDictionaryType(editingType.id, updateData);
        
        // 更新本地状态
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
        const createData = {
          type: values.code,
          name: values.name,
          description: values.description,
        };
        
        const response = await dictionariesApi.createDictionaryType(createData);
        
        // 更新本地状态
        const newType: DictionaryType = {
          id: response.id,
          name: response.name,
          code: response.code,
          description: response.description || '',
          status: true,
          itemCount: 0,
          createdAt: new Date(response.createdAt).toLocaleString(),
          updatedAt: new Date(response.updatedAt).toLocaleString(),
        };
        setDictionaryTypes(prev => [...prev, newType]);
        message.success('添加成功');
      }
      
      setTypeModalVisible(false);
    } catch (error) {
      console.error('保存字典类型失败:', error);
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

  const handleDeleteItem = async (id: number) => {
    try {
      setLoading(true);
      await dictionariesApi.deleteDictionaryItem(id);
      
      // 更新本地状态
      const item = dictionaryItems.find(item => item.id === id);
      setDictionaryItems(prev => prev.filter(item => item.id !== id));
      
      // 更新字典类型的项目数量
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
      console.error('删除字典项失败:', error);
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
        const updateData = {
          label: values.label,
          value: values.value,
          description: values.description,
          sort: values.sort,
        };
        
        await dictionariesApi.updateDictionaryItem(editingItem.id, updateData);
        
        // 更新本地状态
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
        const createData = {
          typeId: Number(values.typeId),
          label: values.label,
          value: values.value,
          description: values.description,
          sort: values.sort,
        };
        
        const response = await dictionariesApi.createDictionaryItem(createData);
        
        // 更新本地状态
        const newItem: DictionaryItem = {
          id: response.id,
          typeId: response.typeId,
          label: response.label,
          value: response.value,
          sort: response.sort || 0,
          status: true,
          description: response.description || '',
          createdAt: new Date(response.createdAt).toLocaleString(),
          updatedAt: new Date(response.updatedAt).toLocaleString(),
        };
        setDictionaryItems(prev => [...prev, newItem]);
        
        // 更新字典类型的项目数量
        setDictionaryTypes(prev => 
          prev.map(type => 
            type.id === Number(values.typeId) 
              ? { ...type, itemCount: type.itemCount + 1 }
              : type
          )
        );
        message.success('添加成功');
      }
      
      setItemModalVisible(false);
    } catch (error) {
      console.error('保存字典项失败:', error);
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
              
              <Spin spinning={typesLoading}>
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
                      setSelectedType(selectedRowKeys[0]?.toString() || null);
                    },
                  }}
                  size="small"
                />
              </Spin>
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
                  
                  <Spin spinning={itemsLoading}>
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
                  </Spin>
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
                <Option value={true}>启用</Option>
                <Option value={false}>禁用</Option>
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
                    <Option value={true}>启用</Option>
                <Option value={false}>禁用</Option>
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