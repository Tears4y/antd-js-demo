import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';

const DemoForm = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({ name: '', age: '' });

  const onFinish = (values) => {
    console.log('Received values of form:', values);
  };

  const handleSetFormData = () => {
    const data = { name: 'John', age: '25' };
    setFormData(data);
    form.setFieldsValue(data);
  };

  return (
    <div>
      <Form form={form} onFinish={onFinish} initialValues={formData}>
        <Form.Item name="name" label="Name">
          <Input />
        </Form.Item>
        <Form.Item name="age" label="Age">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button onClick={handleSetFormData}>Set Data</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DemoForm;
