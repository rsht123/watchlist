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
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSigninMutation } from '../redux/apiSlices/authSlice';
import { User, saveUser } from '../redux/slices/userSlice';
import { useAppDispatch } from '../redux/store';

const LoginForm = () => {
  const [didSubmit, setDidSubmit] = useState(false);
  const [login, { data: user }] = useSigninMutation();

  const handleSubmit = async (data: User) => {
    try {
      await login(data).unwrap();
    } catch (err: any) {
      console.log(err);
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
        Login
      </Typography.Title>
      <Divider style={{ margin: '.5em 0' }} />
      <Form
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
          <NavLink to={'/forgot-password'}>Forgot Password?</NavLink>
        </Col>
      </Row>
      <Row style={{ marginTop: '.5em' }}>
        <Col>
          <NavLink to={'/register'}>Don't have an Account? Register</NavLink>
        </Col>
      </Row>
    </Card>
  );
};

export default LoginForm;
