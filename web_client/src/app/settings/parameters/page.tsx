'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Space,
  Divider,
  message,
  Row,
  Col,
  InputNumber,
  Upload,
  ColorPicker,
  Tabs,
} from 'antd';
import {
  SaveOutlined,
  ReloadOutlined,
  UploadOutlined,
  SettingOutlined,
  SecurityScanOutlined,
  DatabaseOutlined,
  MailOutlined,
} from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import type { Color } from 'antd/es/color-picker';

const { Option } = Select;
const { TextArea } = Input;

interface SystemConfig {
  // 基础设置
  siteName: string;
  siteDescription: string;
  siteKeywords: string;
  logo: string;
  favicon: string;
  
  // 主题设置
  primaryColor: string;
  theme: 'light' | 'dark';
  layout: 'side' | 'top';
  
  // 功能设置
  enableRegistration: boolean;
  enableEmailVerification: boolean;
  enableSmsVerification: boolean;
  enableTwoFactor: boolean;
  
  // 安全设置
  sessionTimeout: number;
  passwordMinLength: number;
  passwordComplexity: boolean;
  maxLoginAttempts: number;
  lockoutDuration: number;
  
  // 邮件设置
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpSsl: boolean;
  
  // 存储设置
  uploadMaxSize: number;
  allowedFileTypes: string[];
  storageType: 'local' | 'oss' | 's3';
  
  // 系统设置
  timezone: string;
  language: string;
  dateFormat: string;
  timeFormat: string;
}

const ParametersPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [config, setConfig] = useState<SystemConfig>({
    siteName: '医疗CRM管理系统',
    siteDescription: '专业的医疗客户关系管理系统',
    siteKeywords: '医疗,CRM,管理系统',
    logo: '',
    favicon: '',
    primaryColor: '#1890ff',
    theme: 'light',
    layout: 'side',
    enableRegistration: true,
    enableEmailVerification: true,
    enableSmsVerification: false,
    enableTwoFactor: false,
    sessionTimeout: 30,
    passwordMinLength: 8,
    passwordComplexity: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    smtpSsl: true,
    uploadMaxSize: 10,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
    storageType: 'local',
    timezone: 'Asia/Shanghai',
    language: 'zh-CN',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss',
  });

  useEffect(() => {
    form.setFieldsValue(config);
  }, [config, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      setConfig({ ...config, ...values });
      message.success('系统参数保存成功');
    } catch {
      message.error('请检查表单输入');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.setFieldsValue(config);
    message.info('已重置为上次保存的配置');
  };

  const handleColorChange = (color: Color) => {
    form.setFieldValue('primaryColor', color.toHexString());
  };

  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: { file: { status?: string; name?: string } }) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
  };

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>系统参数</h1>
        </div>

        <Card>
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <div style={{ marginBottom: '16px' }}>
              <Space>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={loading}
                  onClick={handleSave}
                >
                  保存配置
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </div>

            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              {/* 基础设置 */}
              <Tabs.TabPane
                tab={<span><SettingOutlined />基础设置</span>}
                key="basic"
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="siteName"
                      label="站点名称"
                      rules={[{ required: true, message: '请输入站点名称' }]}
                    >
                      <Input placeholder="请输入站点名称" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="language"
                      label="系统语言"
                      rules={[{ required: true, message: '请选择系统语言' }]}
                    >
                      <Select placeholder="请选择系统语言">
                        <Option value="zh-CN">简体中文</Option>
                        <Option value="en-US">English</Option>
                        <Option value="ja-JP">日本語</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item name="siteDescription" label="站点描述">
                      <TextArea rows={3} placeholder="请输入站点描述" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item name="siteKeywords" label="站点关键词">
                      <Input placeholder="请输入站点关键词，用逗号分隔" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="timezone" label="时区">
                      <Select placeholder="请选择时区">
                        <Option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</Option>
                        <Option value="America/New_York">America/New_York (UTC-5)</Option>
                        <Option value="Europe/London">Europe/London (UTC+0)</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="dateFormat" label="日期格式">
                      <Select placeholder="请选择日期格式">
                        <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                        <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                        <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Tabs.TabPane>

              {/* 主题设置 */}
              <Tabs.TabPane
                tab={<span><SettingOutlined />主题设置</span>}
                key="theme"
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item name="primaryColor" label="主题色">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ColorPicker
                          value={form.getFieldValue('primaryColor')}
                          onChange={handleColorChange}
                        />
                        <Input
                          value={form.getFieldValue('primaryColor')}
                          onChange={(e) => form.setFieldValue('primaryColor', e.target.value)}
                          placeholder="#1890ff"
                          style={{ width: '120px' }}
                        />
                      </div>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="theme" label="主题模式">
                      <Select placeholder="请选择主题模式">
                        <Option value="light">浅色模式</Option>
                        <Option value="dark">深色模式</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="layout" label="布局模式">
                      <Select placeholder="请选择布局模式">
                        <Option value="side">侧边布局</Option>
                        <Option value="top">顶部布局</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="logo" label="系统Logo">
                      <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>上传Logo</Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
              </Tabs.TabPane>

              {/* 安全设置 */}
              <Tabs.TabPane
                tab={<span><SecurityScanOutlined />安全设置</span>}
                key="security"
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item name="sessionTimeout" label="会话超时时间（分钟）">
                      <InputNumber
                        min={5}
                        max={1440}
                        placeholder="30"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="passwordMinLength" label="密码最小长度">
                      <InputNumber
                        min={6}
                        max={32}
                        placeholder="8"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="maxLoginAttempts" label="最大登录尝试次数">
                      <InputNumber
                        min={3}
                        max={10}
                        placeholder="5"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="lockoutDuration" label="锁定时长（分钟）">
                      <InputNumber
                        min={5}
                        max={60}
                        placeholder="15"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Divider>功能开关</Divider>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="enableRegistration" valuePropName="checked">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Switch />
                        <span>允许用户注册</span>
                      </div>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="enableEmailVerification" valuePropName="checked">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Switch />
                        <span>启用邮箱验证</span>
                      </div>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="enableSmsVerification" valuePropName="checked">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Switch />
                        <span>启用短信验证</span>
                      </div>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="enableTwoFactor" valuePropName="checked">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Switch />
                        <span>启用双因子认证</span>
                      </div>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="passwordComplexity" valuePropName="checked">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Switch />
                        <span>密码复杂度检查</span>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              </Tabs.TabPane>

              {/* 邮件设置 */}
              <Tabs.TabPane
                tab={<span><MailOutlined />邮件设置</span>}
                key="email"
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item name="smtpHost" label="SMTP服务器">
                      <Input placeholder="smtp.example.com" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="smtpPort" label="SMTP端口">
                      <InputNumber
                        min={1}
                        max={65535}
                        placeholder="587"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="smtpUser" label="SMTP用户名">
                      <Input placeholder="user@example.com" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="smtpPassword" label="SMTP密码">
                      <Input.Password placeholder="请输入SMTP密码" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="smtpSsl" valuePropName="checked">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Switch />
                        <span>启用SSL/TLS</span>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              </Tabs.TabPane>

              {/* 存储设置 */}
              <Tabs.TabPane
                tab={<span><DatabaseOutlined />存储设置</span>}
                key="storage"
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item name="uploadMaxSize" label="文件上传大小限制（MB）">
                      <InputNumber
                        min={1}
                        max={1024}
                        placeholder="10"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="storageType" label="存储类型">
                      <Select placeholder="请选择存储类型">
                        <Option value="local">本地存储</Option>
                        <Option value="oss">阿里云OSS</Option>
                        <Option value="s3">Amazon S3</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item name="allowedFileTypes" label="允许的文件类型">
                      <Select
                        mode="tags"
                        placeholder="请输入允许的文件扩展名"
                        style={{ width: '100%' }}
                      >
                        <Option value="jpg">jpg</Option>
                        <Option value="jpeg">jpeg</Option>
                        <Option value="png">png</Option>
                        <Option value="gif">gif</Option>
                        <Option value="pdf">pdf</Option>
                        <Option value="doc">doc</Option>
                        <Option value="docx">docx</Option>
                        <Option value="xls">xls</Option>
                        <Option value="xlsx">xlsx</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Tabs.TabPane>
            </Tabs>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ParametersPage;