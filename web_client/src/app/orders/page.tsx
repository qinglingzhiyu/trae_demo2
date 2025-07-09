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
  DatePicker,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import MainLayout from '@/layouts/MainLayout';
import { ordersApi } from '@/api/orders';
import { formatDate, formatCurrency, getOrderStatusLabel, getOrderStatusColor } from '@/utils';
import type { Order, QueryParams } from '@/types';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';


const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const OrdersPage: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [queryParams, setQueryParams] = useState<QueryParams>({
    page: 1,
    limit: 10,
  });
  const [searchForm] = Form.useForm();

  // 获取订单列表
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersApi.getOrders(queryParams);
      setOrders(response.items);
      setTotal(response.total);
    } catch {
      message.error('获取订单列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [queryParams]);

  // 搜索处理
  const handleSearch = (values: Record<string, unknown>) => {
    const { dateRange, ...otherValues } = values;
    
    setQueryParams(prev => {
      const searchParams: QueryParams = {
        ...prev,
        page: 1,
        ...otherValues,
      };

      if (dateRange && Array.isArray(dateRange) && dateRange.length === 2) {
        searchParams.startDate = dayjs(dateRange[0]).format('YYYY-MM-DD');
        searchParams.endDate = dayjs(dateRange[1]).format('YYYY-MM-DD');
      }

      return searchParams;
    });
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setQueryParams(() => ({
      page: 1,
      limit: 10,
    }));
  };

  // 删除订单
  const handleDelete = async (id: number) => {
    try {
      await ordersApi.deleteOrder(id);
      message.success('删除成功');
      fetchOrders();
    } catch {
      message.error('删除失败');
    }
  };

  // 表格列定义
  const columns: ColumnsType<Order> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text: string, record: Order) => (
        <a onClick={() => router.push(`/orders/${record.id}`)}>
          <ShoppingCartOutlined style={{ marginRight: 8 }} />
          {text}
        </a>
      ),
    },
    {
      title: '就诊人',
      dataIndex: ['patient', 'name'],
      key: 'patientName',
      render: (name: string, record: Order) => (
        <Space>
          <span>{name}</span>
          <span style={{ color: '#999', fontSize: '12px' }}>
            {record.patient?.phone}
          </span>
        </Space>
      ),
    },
    {
      title: '订单类型',
      dataIndex: 'orderType',
      key: 'orderType',
      render: (type: string) => {
        const typeMap: Record<string, { label: string; color: string }> = {
          MEDICAL: { label: '医疗服务', color: 'blue' },
          EXAMINATION: { label: '检查', color: 'purple' },
          MEDICINE: { label: '药品', color: 'orange' },
          OTHER: { label: '其他', color: 'green' },
        };
        const config = typeMap[type] || { label: type, color: 'default' };
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getOrderStatusColor(status)}>
          {getOrderStatusLabel(status)}
        </Tag>
      ),
    },
    {
      title: '金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <span style={{ fontWeight: 'bold', color: '#f50' }}>
          {formatCurrency(amount)}
        </span>
      ),
      sorter: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (description: string) => description || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: unknown, record: Order) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/orders/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => router.push(`/orders/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个订单吗？"
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
              订单管理
            </Title>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchOrders}
                loading={loading}
              >
                刷新
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => router.push('/orders/create')}
              >
                新增订单
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
            <Form.Item name="orderNo" style={{ marginBottom: 8 }}>
              <Input
                placeholder="订单号"
                allowClear
                style={{ width: 150 }}
              />
            </Form.Item>
            <Form.Item name="patientName" style={{ marginBottom: 8 }}>
              <Input
                placeholder="就诊人姓名"
                allowClear
                style={{ width: 120 }}
              />
            </Form.Item>
            <Form.Item name="orderType" style={{ marginBottom: 8 }}>
              <Select
                placeholder="订单类型"
                allowClear
                style={{ width: 120 }}
              >
                <Option value="MEDICAL">医疗服务</Option>
                <Option value="EXAMINATION">检查</Option>
                <Option value="MEDICINE">药品</Option>
                <Option value="OTHER">其他</Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" style={{ marginBottom: 8 }}>
              <Select
                placeholder="状态"
                allowClear
                style={{ width: 120 }}
              >
                <Option value="PENDING">待处理</Option>
                <Option value="CONFIRMED">已确认</Option>
                <Option value="PROCESSING">处理中</Option>
                <Option value="PAID">已支付</Option>
                <Option value="COMPLETED">已完成</Option>
                <Option value="CANCELLED">已取消</Option>
                <Option value="REFUNDED">已退款</Option>
              </Select>
            </Form.Item>
            <Form.Item name="dateRange" style={{ marginBottom: 8 }}>
              <RangePicker
                placeholder={['开始日期', '结束日期']}
                style={{ width: 240 }}
              />
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

        {/* 订单表格 */}
        <Card>
          <Table
            dataSource={orders}
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
            scroll={{ x: 1200 }}
            onChange={(pagination, filters, sorter) => {
               if (!Array.isArray(sorter) && sorter.field) {
                 setQueryParams(prev => ({
                   ...prev,
                   sortBy: sorter.field,
                   sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc',
                 }));
               }
             }}
          />
        </Card>
      </div>
    </MainLayout>
  );
};

export default OrdersPage;