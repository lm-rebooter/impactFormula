import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { changePassword } from '@/services/d2g/api';

const ChangePassword: React.FC = () => {
  const [form] = Form.useForm();
  const { initialState } = useModel('@@initialState');
  const [loading, setLoading] = useState(false);

  const handleFinish = (values: any) => {
    setLoading(true);
    const params = {
      email: values.email,
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };
    changePassword({ ...params })
      .then((res: any) => {
        if (res.code === 200) {
          message.success('Modified successfully');
        } else {
          message.error(res.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <PageContainer>
      <Card title="Change Password" bordered={false}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="name"
            name="name"
            initialValue={initialState?.currentUser?.name}
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input placeholder="Enter your name" disabled />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            initialValue={initialState?.currentUser?.email}
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Invalid email format!' },
            ]}
          >
            <Input placeholder="Enter your email" disabled />
          </Form.Item>
          <Form.Item
            label="oldPassword"
            name="oldPassword"
            rules={[{ required: true, message: 'Please input your oldPassword' }]}
            hasFeedback
          >
            <Input.Password placeholder="Enter oldPassword" />
          </Form.Item>
          <Form.Item
            label="newPassword"
            name="newPassword"
            dependencies={['newPassword']}
            hasFeedback
            rules={[{ required: true, message: 'Please input your newPassword!' }]}
          >
            <Input.Password placeholder="Please input your newPassword!" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default ChangePassword;
