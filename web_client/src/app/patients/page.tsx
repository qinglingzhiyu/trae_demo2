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
  UserOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import MainLayout from '@/layouts/MainLayout';
import { patientsApi } from '@/api/patients';
import { formatDate } from '@/utils';
import type { Patient, QueryParams } from '@/types';

const { Title } = Typography;
const { Option } = Select;

const PatientsPage: React.FC = () => {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [queryParams, setQueryParams] = useState<QueryParams>({
    page: 1,
    limit: 10,
  });
  const [searchForm] = Form.useForm();

  // 获取就诊人列表
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientsApi.getPatients(queryParams);
      setPatients(response.items);
      setTotal(response.total);
    } catch {
      message.error('获取就诊人列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
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
    setQueryParams(() => ({
      page: 1,
      limit: 10,
    }));
  };

  // 删除就诊人
  const handleDelete = async (id: number) => {
    try {
      await patientsApi.deletePatient(id);
      message.success('删除成功');
      fetchPatients();
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
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Patient) => (
        <a onClick={() => router.push(`/patients/${record.id}`)}>
          <UserOutlined style={{ marginRight: 8 }} />
          {text}
        </a>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => {
        const genderMap: Record<string, { label: string; color: string }> = {
          MALE: { label: '男', color: 'blue' },
          FEMALE: { label: '女', color: 'pink' },
          OTHER: { label: '其他', color: 'default' },
        };
        const config = genderMap[gender] || { label: gender, color: 'default' };
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      render: (age: number) => age ? `${age}岁` : '-',
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      key: 'idCard',
      render: (idCard: string) => {
        if (!idCard) return '-';
        return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2');
      },
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      render: (address: string) => address || '-',
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
      render: (_: unknown, record: Patient) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/patients/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => router.push(`/patients/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个就诊人吗？"
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
              就诊人管理
            </Title>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchPatients}
                loading={loading}
              >
                刷新
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => router.push('/patients/create')}
              >
                新增就诊人
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
            <Form.Item name="name" style={{ marginBottom: 8 }}>
              <Input
                placeholder="姓名"
                allowClear
                style={{ width: 150 }}
              />
            </Form.Item>
            <Form.Item name="phone" style={{ marginBottom: 8 }}>
              <Input
                placeholder="手机号"
                allowClear
                style={{ width: 150 }}
              />
            </Form.Item>
            <Form.Item name="idCard" style={{ marginBottom: 8 }}>
              <Input
                placeholder="身份证号"
                allowClear
                style={{ width: 180 }}
              />
            </Form.Item>
            <Form.Item name="gender" style={{ marginBottom: 8 }}>
              <Select
                placeholder="性别"
                allowClear
                style={{ width: 100 }}
              >
                <Option value="MALE">男</Option>
                <Option value="FEMALE">女</Option>
                <Option value="OTHER">其他</Option>
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

        {/* 就诊人表格 */}
        <Card>
          <Table
            dataSource={patients}
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
            scroll={{ x: 1000 }}
          />
        </Card>
      </div>
    </MainLayout>
  );
};

export default PatientsPage;