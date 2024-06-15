import {
  Card,
  Typography,
  Divider,
  Input,
  Form,
  Button,
  Checkbox,
  Row,
  Col,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSignupMutation } from '../redux/apiSlices/authSlice';
import { useAppDispatch } from '../redux/store';
import { User, saveUser } from '../redux/slices/userSlice';

const RegisterForm = () => {
  const [form] = Form.useForm();
  const [didSubmit, setDidSubmit] = useState(false);
  const [register, { data: user }] = useSignupMutation();

  const handleSubmit = async (data: User) => {
    try {
      await register(data).unwrap();
    } catch (err: any) {
      message.error(err.data.message);
    }
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch(saveUser(user));
    }
  }, [user]);

  return (
    <Card bordered title={null}>
      <Typography.Title style={{ textAlign: 'center' }} level={4}>
        Register
      </Typography.Title>
      <Divider style={{ margin: '.5em 0' }} />
      <Form
        form={form}
        onFinish={handleSubmit}
        onFinishFailed={() => setDidSubmit(true)}
        layout="vertical"
        wrapperCol={{ span: 24 }}
        autoComplete="off"
        validateTrigger={didSubmit ? 'onChange' : 'onSubmit'}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Please enter your email',
              type: 'email',
            },
          ]}
        >
          <Input placeholder="Enter Email" name="email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          tooltip={
            <span>1 Capital and 1 Integer and minimum 8 Characters</span>
          }
          rules={[
            {
              type: 'string',
              required: true,
              min: 8,
              message: 'Please enter your password',
              whitespace: true,
            },
          ]}
        >
          <Input.Password placeholder="Enter Password" name="password" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" initialValue={false}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" block htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Row>
        <Col>
          <NavLink to={'/login'}>Already have an Account? Login</NavLink>
        </Col>
      </Row>
    </Card>
  );
};

export default RegisterForm;
