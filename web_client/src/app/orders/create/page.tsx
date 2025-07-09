'use client';

import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  InputNumber,
  Space,
  message,
  Divider,
  Typography,
  Table,
  Popconfirm
} from 'antd';
import { useRouter } from 'next/navigation';
import { MinusCircleOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { ordersApi } from '@/api/orders';
import { patientsApi } from '@/api/patients';
import { Patient, OrderType, OrderItem } from '@/types';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface CreateOrderForm {
  patientId: number;
  orderType: OrderType;
  description?: string;
  items: {
    itemName: string;
    itemCode?: string;
    price: number;
    quantity: number;
  }[];
}

const CreateOrderPage: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm<CreateOrderForm>();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);

  // 获取患者列表
  const fetchPatients = async () => {
    try {
      setPatientsLoading(true);
      const response = await patientsApi.getPatients({ page: 1, pageSize: 100 });
      setPatients(response.items);
    } catch (error) {
      console.error('获取患者列表失败:', error);
      message.error('获取患者列表失败');
    } finally {
      setPatientsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // 提交表单
  const handleSubmit = async (values: CreateOrderForm) => {
    try {
      setLoading(true);
      
      // 构造订单数据
      const orderData = {
        patientId: values.patientId,
        orderType: values.orderType,
        description: values.description,
        items: values.items.map(item => ({
          itemName: item.itemName,
          itemCode: item.itemCode,
          price: item.price,
          quantity: item.quantity
        }))
      };

      await ordersApi.createOrder(orderData);
      message.success('订单创建成功');
      router.push('/orders');
    } catch (error: any) {
      console.error('创建订单失败:', error);
      message.error(error?.response?.data?.message || '创建订单失败');
    } finally {
      setLoading(false);
    }
  };

  // 计算总金额
  const calculateTotal = (items: any[]) => {
    return items?.reduce((sum, item) => {
      return sum + (item?.price || 0) * (item?.quantity || 0);
    }, 0) || 0;
  };

  // 订单类型选项
  const orderTypeOptions = [
    { label: '医疗服务', value: OrderType.MEDICAL },
    { label: '检查', value: OrderType.EXAMINATION },
    { label: '药品', value: OrderType.MEDICINE },
    { label: '其他', value: OrderType.OTHER },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.back()}
            style={{ marginBottom: '16px' }}
          >
            返回
          </Button>
          <Title level={2}>新增订单</Title>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            items: [{ itemName: '', price: 0, quantity: 1 }]
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="patientId"
                label="选择患者"
                rules={[{ required: true, message: '请选择患者' }]}
              >
                <Select
                  placeholder="请选择患者"
                  loading={patientsLoading}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {patients.map(patient => (
                    <Option key={patient.id} value={patient.id}>
                      {patient.name} - {patient.phone}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="orderType"
                label="订单类型"
                rules={[{ required: true, message: '请选择订单类型' }]}
              >
                <Select placeholder="请选择订单类型">
                  {orderTypeOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="订单描述"
          >
            <TextArea 
              rows={3} 
              placeholder="请输入订单描述（可选）"
            />
          </Form.Item>

          <Divider>订单项目</Divider>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card 
                    key={key} 
                    size="small" 
                    style={{ marginBottom: '16px' }}
                    title={`项目 ${name + 1}`}
                    extra={
                      fields.length > 1 && (
                        <Popconfirm
                          title="确定删除此项目吗？"
                          onConfirm={() => remove(name)}
                        >
                          <Button 
                            type="text" 
                            danger 
                            icon={<MinusCircleOutlined />}
                          >
                            删除
                          </Button>
                        </Popconfirm>
                      )
                    }
                  >
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'itemName']}
                          label="项目名称"
                          rules={[{ required: true, message: '请输入项目名称' }]}
                        >
                          <Input placeholder="请输入项目名称" />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'itemCode']}
                          label="项目代码"
                        >
                          <Input placeholder="项目代码（可选）" />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item
                          {...restField}
                          name={[name, 'price']}
                          label="单价"
                          rules={[{ required: true, message: '请输入单价' }]}
                        >
                          <InputNumber
                            min={0}
                            precision={2}
                            placeholder="单价"
                            style={{ width: '100%' }}
                            addonAfter="元"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item
                          {...restField}
                          name={[name, 'quantity']}
                          label="数量"
                          rules={[{ required: true, message: '请输入数量' }]}
                        >
                          <InputNumber
                            min={1}
                            placeholder="数量"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add({ itemName: '', price: 0, quantity: 1 })}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加项目
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item dependencies={['items']}>
            {({ getFieldValue }) => {
              const items = getFieldValue('items') || [];
              const total = calculateTotal(items);
              return (
                <Card size="small" style={{ backgroundColor: '#f5f5f5' }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <strong>订单总金额：</strong>
                    </Col>
                    <Col>
                      <span style={{ fontSize: '18px', color: '#1890ff', fontWeight: 'bold' }}>
                        ¥{total.toFixed(2)}
                      </span>
                    </Col>
                  </Row>
                </Card>
              );
            }}
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                创建订单
              </Button>
              <Button onClick={() => router.back()}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateOrderPage;