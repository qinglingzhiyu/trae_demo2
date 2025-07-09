'use client';

import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  message,
  Row,
  Col,
  Avatar,
  Upload,
  Select,
  Switch,
  Divider,
  Tabs,
  DatePicker,
  TimePicker,
} from 'antd';
import {
  UserOutlined,
  SaveOutlined,
  ReloadOutlined,
  UploadOutlined,
  SecurityScanOutlined,
  BellOutlined,
} from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';


const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface UserProfile {
  username: string;
  email: string;
  phone: string;
  realName: string;
  department: string;
  position: string;
  avatar: string;
  bio: string;
  birthday: string;
  gender: string;
  address: string;
}

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  enableTwoFactor: boolean;
  loginNotification: boolean;
}

interface NotificationSettings {
  emailNotification: boolean;
  smsNotification: boolean;
  systemNotification: boolean;
  orderNotification: boolean;
  patientNotification: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

const PersonalSettings: React.FC = () => {
  const [form] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarUrl, setAvatarUrl] = useState<string>('/api/placeholder/100/100');

  // 模拟用户数据
  const [userProfile] = useState<UserProfile>({
    username: 'admin',
    email: 'admin@example.com',
    phone: '13800138000',
    realName: '管理员',
    department: '技术部',
    position: '系统管理员',
    avatar: '/api/placeholder/100/100',
    bio: '负责系统维护和用户管理',
    birthday: '1990-01-01',
    gender: 'male',
    address: '北京市朝阳区',
  });

  const [securitySettings] = useState<SecuritySettings>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    enableTwoFactor: false,
    loginNotification: true,
  });

  const [notificationSettings] = useState<NotificationSettings>({
    emailNotification: true,
    smsNotification: false,
    systemNotification: true,
    orderNotification: true,
    patientNotification: true,
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00',
    },
  });

  React.useEffect(() => {
    form.setFieldsValue(userProfile);
    securityForm.setFieldsValue(securitySettings);
    notificationForm.setFieldsValue(notificationSettings);
  }, [form, securityForm, notificationForm, userProfile, securitySettings, notificationSettings]);

  const handleProfileSave = async (values: UserProfile) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('保存个人信息:', values);
      message.success('个人信息保存成功');
    } catch {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySave = async (values: SecuritySettings) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('保存安全设置:', values);
      message.success('安全设置保存成功');
      securityForm.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
    } catch {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSave = async (values: NotificationSettings) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('保存通知设置:', values);
      message.success('通知设置保存成功');
    } catch {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'done') {
      // 模拟获取上传后的URL
      setAvatarUrl('/api/placeholder/100/100');
      message.success('头像上传成功');
    } else if (info.file.status === 'error') {
      message.error('头像上传失败');
    }
  };



  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>个人设置</h1>
        </div>

        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            {/* 个人信息 */}
            <TabPane
              tab={<span><UserOutlined />个人信息</span>}
              key="profile"
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleProfileSave}
                style={{ maxWidth: '800px' }}
              >
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                  <Avatar size={100} src={avatarUrl} icon={<UserOutlined />} />
                  <div style={{ marginTop: '16px' }}>
                    <Upload
                      name="avatar"
                      listType="picture"
                      showUploadList={false}
                      action="/api/upload/avatar"
                      onChange={handleAvatarChange}
                    >
                      <Button icon={<UploadOutlined />}>更换头像</Button>
                    </Upload>
                  </div>
                </div>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="username"
                      label="用户名"
                      rules={[{ required: true, message: '请输入用户名' }]}
                    >
                      <Input placeholder="请输入用户名" disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="realName"
                      label="真实姓名"
                      rules={[{ required: true, message: '请输入真实姓名' }]}
                    >
                      <Input placeholder="请输入真实姓名" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="email"
                      label="邮箱"
                      rules={[
                        { required: true, message: '请输入邮箱' },
                        { type: 'email', message: '请输入有效的邮箱地址' }
                      ]}
                    >
                      <Input placeholder="请输入邮箱" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="phone"
                      label="手机号"
                      rules={[{ required: true, message: '请输入手机号' }]}
                    >
                      <Input placeholder="请输入手机号" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="department" label="部门">
                      <Select placeholder="请选择部门">
                        <Option value="技术部">技术部</Option>
                        <Option value="医务部">医务部</Option>
                        <Option value="行政部">行政部</Option>
                        <Option value="财务部">财务部</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="position" label="职位">
                      <Input placeholder="请输入职位" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="gender" label="性别">
                      <Select placeholder="请选择性别">
                        <Option value="male">男</Option>
                        <Option value="female">女</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="birthday" label="生日">
                      <DatePicker
                        style={{ width: '100%' }}
                        placeholder="请选择生日"
                        format="YYYY-MM-DD"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item name="address" label="地址">
                      <Input placeholder="请输入地址" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item name="bio" label="个人简介">
                      <TextArea rows={3} placeholder="请输入个人简介" />
                    </Form.Item>
                  </Col>
                </Row>

                <div style={{ marginTop: '24px' }}>
                  <Space>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      loading={loading}
                      htmlType="submit"
                    >
                      保存信息
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={() => form.resetFields()}>
                      重置
                    </Button>
                  </Space>
                </div>
              </Form>
            </TabPane>

            {/* 安全设置 */}
            <TabPane
              tab={<span><SecurityScanOutlined />安全设置</span>}
              key="security"
            >
              <Form
                form={securityForm}
                layout="vertical"
                onFinish={handleSecuritySave}
                style={{ maxWidth: '600px' }}
              >
                <h3>修改密码</h3>
                <Form.Item
                  name="currentPassword"
                  label="当前密码"
                  rules={[{ required: true, message: '请输入当前密码' }]}
                >
                  <Input.Password placeholder="请输入当前密码" />
                </Form.Item>
                <Form.Item
                  name="newPassword"
                  label="新密码"
                  rules={[
                    { required: true, message: '请输入新密码' },
                    { min: 6, message: '密码长度至少6位' }
                  ]}
                >
                  <Input.Password placeholder="请输入新密码" />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="确认新密码"
                  rules={[{ required: true, message: '请确认新密码' }]}
                >
                  <Input.Password placeholder="请再次输入新密码" />
                </Form.Item>

                <Divider />

                <h3>安全选项</h3>
                <Form.Item name="enableTwoFactor" valuePropName="checked">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Switch />
                    <span>启用双因素认证</span>
                  </div>
                </Form.Item>
                <Form.Item name="loginNotification" valuePropName="checked">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Switch />
                    <span>登录通知</span>
                  </div>
                </Form.Item>

                <div style={{ marginTop: '24px' }}>
                  <Space>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      loading={loading}
                      htmlType="submit"
                    >
                      保存设置
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={() => securityForm.resetFields()}>
                      重置
                    </Button>
                  </Space>
                </div>
              </Form>
            </TabPane>

            {/* 通知设置 */}
            <TabPane
              tab={<span><BellOutlined />通知设置</span>}
              key="notification"
            >
              <Form
                form={notificationForm}
                layout="vertical"
                onFinish={handleNotificationSave}
                style={{ maxWidth: '600px' }}
              >
                <h3>通知方式</h3>
                <Form.Item name="emailNotification" valuePropName="checked">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Switch />
                    <span>邮件通知</span>
                  </div>
                </Form.Item>
                <Form.Item name="smsNotification" valuePropName="checked">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Switch />
                    <span>短信通知</span>
                  </div>
                </Form.Item>
                <Form.Item name="systemNotification" valuePropName="checked">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Switch />
                    <span>系统通知</span>
                  </div>
                </Form.Item>

                <Divider />

                <h3>通知内容</h3>
                <Form.Item name="orderNotification" valuePropName="checked">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Switch />
                    <span>订单通知</span>
                  </div>
                </Form.Item>
                <Form.Item name="patientNotification" valuePropName="checked">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Switch />
                    <span>患者通知</span>
                  </div>
                </Form.Item>

                <Divider />

                <h3>免打扰时间</h3>
                <Form.Item name={['quietHours', 'enabled']} valuePropName="checked">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Switch />
                    <span>启用免打扰时间</span>
                  </div>
                </Form.Item>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item name={['quietHours', 'startTime']} label="开始时间">
                      <TimePicker
                        style={{ width: '100%' }}
                        format="HH:mm"
                        placeholder="选择开始时间"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name={['quietHours', 'endTime']} label="结束时间">
                      <TimePicker
                        style={{ width: '100%' }}
                        format="HH:mm"
                        placeholder="选择结束时间"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <div style={{ marginTop: '24px' }}>
                  <Space>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      loading={loading}
                      htmlType="submit"
                    >
                      保存设置
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={() => notificationForm.resetFields()}>
                      重置
                    </Button>
                  </Space>
                </div>
              </Form>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PersonalSettings;