'use client';

import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Typography,
  Row,
  Col,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import MainLayout from '@/layouts/MainLayout';
import { usersApi } from '@/api/users';
import { User, UserRole, UserStatus } from '@/types';

const { Title } = Typography;
const { Option } = Select;

interface CreateUserForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  status: string;
}

const CreateUserPage: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm<CreateUserForm>();
  const [loading, setLoading] = useState(false);

  // 提交表单
  const handleSubmit = async (values: CreateUserForm) => {
    try {
      setLoading(true);
      const { confirmPassword, ...userData } = values;
      await usersApi.createUser({
        ...userData,
        role: userData.role as UserRole,
        status: userData.status as UserStatus
      });
      message.success('用户创建成功');
      router.push('/users');
    } catch (error: any) {
      message.error(error.response?.data?.message || '创建用户失败');
    } finally {
      setLoading(false);
    }
  };

  // 表单验证规则
  const validateConfirmPassword = (_: any, value: string) => {
    if (!value || form.getFieldValue('password') === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('两次输入的密码不一致'));
  };

  return (
    <MainLayout>
      <div>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Space>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => router.back()}
              >
                返回
              </Button>
              <Title level={2} style={{ margin: 0 }}>
                新增C端用户
              </Title>
            </Space>
          </Col>
        </Row>

        <Row justify="center">
          <Col xs={24} sm={20} md={16} lg={12} xl={10}>
            <Card>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  status: 'ACTIVE',
                  role: 'USER', // 默认为C端用户
                }}
              >
                <Form.Item
                  label="用户名"
                  name="username"
                  rules={[
                    { required: true, message: '请输入用户名' },
                    { min: 3, message: '用户名至少3个字符' },
                    { max: 20, message: '用户名最多20个字符' },
                    {
                      pattern: /^[a-zA-Z0-9_]+$/,
                      message: '用户名只能包含字母、数字和下划线',
                    },
                  ]}
                >
                  <Input
                    placeholder="请输入用户名"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="邮箱"
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址' },
                  ]}
                >
                  <Input
                    placeholder="请输入邮箱"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="密码"
                  name="password"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少6个字符' },
                    {
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
                      message: '密码必须包含大小写字母和数字',
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="请输入密码"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="确认密码"
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: '请确认密码' },
                    { validator: validateConfirmPassword },
                  ]}
                >
                  <Input.Password
                    placeholder="请再次输入密码"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="角色"
                  name="role"
                  rules={[
                    { required: true, message: '请选择角色' },
                  ]}
                >
                  <Select
                    placeholder="请选择角色"
                    size="large"
                    disabled // 禁用选择，固定为C端用户
                  >
                    <Option value="USER">C端用户</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="状态"
                  name="status"
                  rules={[
                    { required: true, message: '请选择状态' },
                  ]}
                >
                  <Select
                    placeholder="请选择状态"
                    size="large"
                  >
                    <Option value="ACTIVE">激活</Option>
                    <Option value="INACTIVE">未激活</Option>
                    <Option value="SUSPENDED">暂停</Option>
                  </Select>
                </Form.Item>

                <Form.Item style={{ marginTop: 32 }}>
                  <Space style={{ width: '100%', justifyContent: 'center' }}>
                    <Button
                      size="large"
                      onClick={() => router.back()}
                    >
                      取消
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      loading={loading}
                      icon={<SaveOutlined />}
                    >
                      创建用户
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>

        {/* 提示信息 */}
        <Row justify="center" style={{ marginTop: 16 }}>
          <Col xs={24} sm={20} md={16} lg={12} xl={10}>
            <Card size="small" style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
              <Typography.Text type="secondary">
                <strong>密码要求：</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li>至少6个字符</li>
                  <li>必须包含大写字母、小写字母和数字</li>
                  <li>可以包含特殊字符 @$!%*?&</li>
                </ul>
              </Typography.Text>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default CreateUserPage;