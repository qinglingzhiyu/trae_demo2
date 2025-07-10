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
  Tabs,
  Badge,
  Avatar,
  List,
  Typography,
  Divider,
  DatePicker,
  Radio,
  Checkbox,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  BellOutlined,
  MailOutlined,
  MessageOutlined,
  MobileOutlined,
  SendOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;
const { TabPane } = Tabs;
const { Text, Title } = Typography;

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'system' | 'push';
  title: string;
  content: string;
  variables: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface NotificationRecord {
  id: string;
  templateId: string;
  templateName: string;
  type: 'email' | 'sms' | 'system' | 'push';
  title: string;
  content: string;
  recipient: string;
  recipientType: 'user' | 'role' | 'all';
  status: 'pending' | 'sent' | 'failed' | 'read';
  sentAt?: string;
  readAt?: string;
  errorMessage?: string;
  createdAt: string;
}

interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  systemEnabled: boolean;
  pushEnabled: boolean;
  emailConfig: {
    host: string;
    port: number;
    username: string;
    password: string;
    ssl: boolean;
  };
  smsConfig: {
    provider: string;
    accessKey: string;
    secretKey: string;
    signName: string;
  };
}

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [loading, setLoading] = useState(false);
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [templateForm] = Form.useForm();
  const [sendForm] = Form.useForm();
  const [settingsForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  // 模拟数据
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: '用户注册欢迎',
      type: 'email',
      title: '欢迎注册医疗CRM系统',
      content: '亲爱的 {{userName}}，欢迎您注册我们的医疗CRM系统！您的账号是：{{userEmail}}',
      variables: ['userName', 'userEmail'],
      status: 'active',
      createdAt: '2024-01-15 10:30:00',
      updatedAt: '2024-01-15 10:30:00',
    },
    {
      id: '2',
      name: '订单状态更新',
      type: 'sms',
      title: '订单状态更新通知',
      content: '您的订单 {{orderNo}} 状态已更新为：{{status}}，请及时查看。',
      variables: ['orderNo', 'status'],
      status: 'active',
      createdAt: '2024-01-15 11:00:00',
      updatedAt: '2024-01-15 11:00:00',
    },
    {
      id: '3',
      name: '系统维护通知',
      type: 'system',
      title: '系统维护通知',
      content: '系统将于 {{maintenanceTime}} 进行维护，预计耗时 {{duration}} 小时，请提前做好准备。',
      variables: ['maintenanceTime', 'duration'],
      status: 'active',
      createdAt: '2024-01-15 12:00:00',
      updatedAt: '2024-01-15 12:00:00',
    },
  ]);

  const [records, setRecords] = useState<NotificationRecord[]>([
    {
      id: '1',
      templateId: '1',
      templateName: '用户注册欢迎',
      type: 'email',
      title: '欢迎注册医疗CRM系统',
      content: '亲爱的张三，欢迎您注册我们的医疗CRM系统！您的账号是：zhangsan@example.com',
      recipient: 'zhangsan@example.com',
      recipientType: 'user',
      status: 'sent',
      sentAt: '2024-01-15 14:30:25',
      readAt: '2024-01-15 14:35:10',
      createdAt: '2024-01-15 14:30:20',
    },
    {
      id: '2',
      templateId: '2',
      templateName: '订单状态更新',
      type: 'sms',
      title: '订单状态更新通知',
      content: '您的订单 ORD20240115001 状态已更新为：已完成，请及时查看。',
      recipient: '13800138000',
      recipientType: 'user',
      status: 'sent',
      sentAt: '2024-01-15 14:25:15',
      createdAt: '2024-01-15 14:25:10',
    },
    {
      id: '3',
      templateId: '3',
      templateName: '系统维护通知',
      type: 'system',
      title: '系统维护通知',
      content: '系统将于 2024-01-16 02:00 进行维护，预计耗时 2 小时，请提前做好准备。',
      recipient: 'all',
      recipientType: 'all',
      status: 'pending',
      createdAt: '2024-01-15 14:20:00',
    },
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    emailEnabled: true,
    smsEnabled: true,
    systemEnabled: true,
    pushEnabled: false,
    emailConfig: {
      host: 'smtp.example.com',
      port: 587,
      username: 'noreply@example.com',
      password: '',
      ssl: true,
    },
    smsConfig: {
      provider: 'aliyun',
      accessKey: '',
      secretKey: '',
      signName: '医疗CRM',
    },
  });

  // 模板表格列
  const templateColumns: ColumnsType<NotificationTemplate> = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const config = {
          email: { color: 'blue', icon: <MailOutlined />, text: '邮件' },
          sms: { color: 'green', icon: <MessageOutlined />, text: '短信' },
          system: { color: 'orange', icon: <BellOutlined />, text: '系统' },
          push: { color: 'purple', icon: <MobileOutlined />, text: '推送' },
        }[type];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '变量',
      dataIndex: 'variables',
      key: 'variables',
      render: (variables) => (
        <div>
          {variables.map((variable: string) => (
            <Tag key={variable} size="small">
              {`{{${variable}}}`}
            </Tag>
          ))}
        </div>
      ),
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
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditTemplate(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<SendOutlined />}
            onClick={() => handleSendNotification(record)}
          >
            发送
          </Button>
          <Popconfirm
            title="确定要删除这个模板吗？"
            onConfirm={() => handleDeleteTemplate(record.id)}
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

  // 发送记录表格列
  const recordColumns: ColumnsType<NotificationRecord> = [
    {
      title: '发送时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      sorter: true,
    },
    {
      title: '模板',
      dataIndex: 'templateName',
      key: 'templateName',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const config = {
          email: { color: 'blue', icon: <MailOutlined />, text: '邮件' },
          sms: { color: 'green', icon: <MessageOutlined />, text: '短信' },
          system: { color: 'orange', icon: <BellOutlined />, text: '系统' },
          push: { color: 'purple', icon: <MobileOutlined />, text: '推送' },
        }[type];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '接收者',
      dataIndex: 'recipient',
      key: 'recipient',
      render: (recipient, record) => (
        <div>
          <div>{recipient}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            {record.recipientType === 'all' ? '全部用户' : 
             record.recipientType === 'role' ? '角色用户' : '指定用户'}
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const config = {
          pending: { color: 'orange', text: '待发送' },
          sent: { color: 'green', text: '已发送' },
          failed: { color: 'red', text: '发送失败' },
          read: { color: 'blue', text: '已读' },
        }[status];
        return (
          <div>
            <Tag color={config.color}>{config.text}</Tag>
            {status === 'sent' && record.readAt && (
              <div style={{ fontSize: '12px', color: '#999' }}>
                已读：{record.readAt}
              </div>
            )}
            {status === 'failed' && record.errorMessage && (
              <div style={{ fontSize: '12px', color: '#ff4d4f' }}>
                {record.errorMessage}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewRecord(record)}
        >
          详情
        </Button>
      ),
    },
  ];

  // 处理模板操作
  const handleAddTemplate = () => {
    setEditingTemplate(null);
    templateForm.resetFields();
    setTemplateModalVisible(true);
  };

  const handleEditTemplate = (template: NotificationTemplate) => {
    setEditingTemplate(template);
    templateForm.setFieldsValue(template);
    setTemplateModalVisible(true);
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      setLoading(true);
      setTemplates(prev => prev.filter(item => item.id !== id));
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      const values = await templateForm.validateFields();
      setLoading(true);
      
      if (editingTemplate) {
        setTemplates(prev => 
          prev.map(item => 
            item.id === editingTemplate.id 
              ? { ...item, ...values, updatedAt: new Date().toLocaleString() }
              : item
          )
        );
        message.success('更新成功');
      } else {
        const newTemplate: NotificationTemplate = {
          id: Date.now().toString(),
          ...values,
          variables: values.content.match(/\{\{(\w+)\}\}/g)?.map((match: string) => match.slice(2, -2)) || [],
          createdAt: new Date().toLocaleString(),
          updatedAt: new Date().toLocaleString(),
        };
        setTemplates(prev => [...prev, newTemplate]);
        message.success('添加成功');
      }
      
      setTemplateModalVisible(false);
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  // 发送通知
  const handleSendNotification = (template: NotificationTemplate) => {
    sendForm.resetFields();
    sendForm.setFieldsValue({
      templateId: template.id,
      templateName: template.name,
      type: template.type,
      title: template.title,
      content: template.content,
    });
    setSendModalVisible(true);
  };

  const handleSend = async () => {
    try {
      const values = await sendForm.validateFields();
      setLoading(true);
      
      const newRecord: NotificationRecord = {
        id: Date.now().toString(),
        ...values,
        status: 'pending',
        createdAt: new Date().toLocaleString(),
      };
      
      setRecords(prev => [newRecord, ...prev]);
      message.success('通知已加入发送队列');
      setSendModalVisible(false);
      
      // 模拟发送过程
      setTimeout(() => {
        setRecords(prev => 
          prev.map(record => 
            record.id === newRecord.id 
              ? { ...record, status: 'sent', sentAt: new Date().toLocaleString() }
              : record
          )
        );
      }, 2000);
    } catch (error) {
      message.error('发送失败');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecord = (record: NotificationRecord) => {
    Modal.info({
      title: '通知详情',
      width: 600,
      content: (
        <div>
          <p><strong>标题：</strong>{record.title}</p>
          <p><strong>内容：</strong></p>
          <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
            {record.content}
          </div>
          <p><strong>接收者：</strong>{record.recipient}</p>
          <p><strong>发送时间：</strong>{record.sentAt || '未发送'}</p>
          {record.readAt && <p><strong>阅读时间：</strong>{record.readAt}</p>}
        </div>
      ),
    });
  };

  // 设置管理
  const handleOpenSettings = () => {
    settingsForm.setFieldsValue(settings);
    setSettingsModalVisible(true);
  };

  const handleSaveSettings = async () => {
    try {
      const values = await settingsForm.validateFields();
      setSettings(values);
      message.success('设置保存成功');
      setSettingsModalVisible(false);
    } catch (error) {
      message.error('保存失败');
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>消息通知</h1>
        </div>

        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            {/* 通知模板 */}
            <TabPane tab="通知模板" key="templates">
              <div style={{ marginBottom: '16px' }}>
                <Row justify="space-between">
                  <Col>
                    <Search
                      placeholder="搜索模板名称、标题"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: 300 }}
                    />
                  </Col>
                  <Col>
                    <Space>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddTemplate}
                      >
                        新增模板
                      </Button>
                      <Button icon={<ReloadOutlined />} onClick={() => setLoading(false)}>
                        刷新
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </div>
              
              <Table
                columns={templateColumns}
                dataSource={templates.filter(template => 
                  template.name.toLowerCase().includes(searchText.toLowerCase()) ||
                  template.title.toLowerCase().includes(searchText.toLowerCase())
                )}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条`,
                }}
              />
            </TabPane>

            {/* 发送记录 */}
            <TabPane tab="发送记录" key="records">
              <div style={{ marginBottom: '16px' }}>
                <Row justify="space-between">
                  <Col>
                    <Search
                      placeholder="搜索模板、接收者"
                      style={{ width: 300 }}
                    />
                  </Col>
                  <Col>
                    <Space>
                      <Button icon={<ReloadOutlined />} onClick={() => setLoading(false)}>
                        刷新
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </div>
              
              <Table
                columns={recordColumns}
                dataSource={records}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条`,
                }}
              />
            </TabPane>

            {/* 通知设置 */}
            <TabPane tab="通知设置" key="settings">
              <div style={{ maxWidth: 800 }}>
                <Card title="通知渠道设置" style={{ marginBottom: 24 }}>
                  <Row gutter={24}>
                    <Col span={6}>
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        <MailOutlined style={{ fontSize: '32px', color: settings.emailEnabled ? '#1890ff' : '#d9d9d9' }} />
                        <div style={{ marginTop: '8px' }}>邮件通知</div>
                        <Switch 
                          checked={settings.emailEnabled} 
                          onChange={(checked) => setSettings(prev => ({ ...prev, emailEnabled: checked }))}
                          style={{ marginTop: '8px' }}
                        />
                      </div>
                    </Col>
                    <Col span={6}>
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        <MessageOutlined style={{ fontSize: '32px', color: settings.smsEnabled ? '#52c41a' : '#d9d9d9' }} />
                        <div style={{ marginTop: '8px' }}>短信通知</div>
                        <Switch 
                          checked={settings.smsEnabled} 
                          onChange={(checked) => setSettings(prev => ({ ...prev, smsEnabled: checked }))}
                          style={{ marginTop: '8px' }}
                        />
                      </div>
                    </Col>
                    <Col span={6}>
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        <BellOutlined style={{ fontSize: '32px', color: settings.systemEnabled ? '#fa8c16' : '#d9d9d9' }} />
                        <div style={{ marginTop: '8px' }}>系统通知</div>
                        <Switch 
                          checked={settings.systemEnabled} 
                          onChange={(checked) => setSettings(prev => ({ ...prev, systemEnabled: checked }))}
                          style={{ marginTop: '8px' }}
                        />
                      </div>
                    </Col>
                    <Col span={6}>
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        <MobileOutlined style={{ fontSize: '32px', color: settings.pushEnabled ? '#722ed1' : '#d9d9d9' }} />
                        <div style={{ marginTop: '8px' }}>推送通知</div>
                        <Switch 
                          checked={settings.pushEnabled} 
                          onChange={(checked) => setSettings(prev => ({ ...prev, pushEnabled: checked }))}
                          style={{ marginTop: '8px' }}
                        />
                      </div>
                    </Col>
                  </Row>
                </Card>

                <Space>
                  <Button type="primary" onClick={handleOpenSettings}>
                    配置通知参数
                  </Button>
                  <Button onClick={() => message.success('测试通知发送成功')}>
                    发送测试通知
                  </Button>
                </Space>
              </div>
            </TabPane>
          </Tabs>
        </Card>

        {/* 模板编辑模态框 */}
        <Modal
          title={editingTemplate ? '编辑通知模板' : '新增通知模板'}
          open={templateModalVisible}
          onOk={handleSaveTemplate}
          onCancel={() => setTemplateModalVisible(false)}
          confirmLoading={loading}
          width={800}
        >
          <Form form={templateForm} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="模板名称"
                  rules={[{ required: true, message: '请输入模板名称' }]}
                >
                  <Input placeholder="请输入模板名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="通知类型"
                  rules={[{ required: true, message: '请选择通知类型' }]}
                >
                  <Select placeholder="请选择通知类型">
                    <Option value="email">邮件</Option>
                    <Option value="sms">短信</Option>
                    <Option value="system">系统</Option>
                    <Option value="push">推送</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="title"
              label="通知标题"
              rules={[{ required: true, message: '请输入通知标题' }]}
            >
              <Input placeholder="请输入通知标题" />
            </Form.Item>
            <Form.Item
              name="content"
              label="通知内容"
              rules={[{ required: true, message: '请输入通知内容' }]}
              extra="支持变量：{{变量名}}，如 {{userName}}、{{orderNo}} 等"
            >
              <TextArea rows={6} placeholder="请输入通知内容，支持变量替换" />
            </Form.Item>
            <Form.Item
              name="status"
              label="状态"
              initialValue="active"
            >
              <Radio.Group>
                <Radio value="active">启用</Radio>
                <Radio value="inactive">禁用</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Modal>

        {/* 发送通知模态框 */}
        <Modal
          title="发送通知"
          open={sendModalVisible}
          onOk={handleSend}
          onCancel={() => setSendModalVisible(false)}
          confirmLoading={loading}
          width={600}
        >
          <Form form={sendForm} layout="vertical">
            <Form.Item name="templateId" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="templateName" label="通知模板">
              <Input disabled />
            </Form.Item>
            <Form.Item name="type" label="通知类型">
              <Select disabled>
                <Option value="email">邮件</Option>
                <Option value="sms">短信</Option>
                <Option value="system">系统</Option>
                <Option value="push">推送</Option>
              </Select>
            </Form.Item>
            <Form.Item name="title" label="通知标题">
              <Input />
            </Form.Item>
            <Form.Item name="content" label="通知内容">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="recipientType"
              label="接收者类型"
              rules={[{ required: true, message: '请选择接收者类型' }]}
            >
              <Radio.Group>
                <Radio value="user">指定用户</Radio>
                <Radio value="role">指定角色</Radio>
                <Radio value="all">全部用户</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="recipient"
              label="接收者"
              rules={[{ required: true, message: '请输入接收者' }]}
            >
              <Input placeholder="请输入邮箱、手机号或用户ID" />
            </Form.Item>
          </Form>
        </Modal>

        {/* 通知设置模态框 */}
        <Modal
          title="通知参数配置"
          open={settingsModalVisible}
          onOk={handleSaveSettings}
          onCancel={() => setSettingsModalVisible(false)}
          width={800}
        >
          <Form form={settingsForm} layout="vertical">
            <Tabs>
              <TabPane tab="邮件配置" key="email">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name={['emailConfig', 'host']} label="SMTP服务器">
                      <Input placeholder="smtp.example.com" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={['emailConfig', 'port']} label="端口">
                      <Input placeholder="587" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={['emailConfig', 'username']} label="用户名">
                      <Input placeholder="noreply@example.com" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={['emailConfig', 'password']} label="密码">
                      <Input.Password placeholder="请输入密码" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={['emailConfig', 'ssl']} valuePropName="checked">
                      <Checkbox>启用SSL/TLS</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="短信配置" key="sms">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name={['smsConfig', 'provider']} label="服务商">
                      <Select>
                        <Option value="aliyun">阿里云</Option>
                        <Option value="tencent">腾讯云</Option>
                        <Option value="huawei">华为云</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={['smsConfig', 'signName']} label="签名">
                      <Input placeholder="医疗CRM" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={['smsConfig', 'accessKey']} label="AccessKey">
                      <Input placeholder="请输入AccessKey" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={['smsConfig', 'secretKey']} label="SecretKey">
                      <Input.Password placeholder="请输入SecretKey" />
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;