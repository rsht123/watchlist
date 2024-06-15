import { Button, Col, Form, Input, Row, Typography, message } from 'antd';
import {
  useLazyAuthorizeRequestTokenQuery,
  useLazyCreateRequestTokenQuery,
  useUpdateProfileMutation,
  useWhoAmIQuery,
} from '../redux/apiSlices/authSlice';
import { useState, useEffect } from 'react';
import { appConfig } from '../appConfig';
import { useSearchParams } from 'react-router-dom';

const Profile = () => {
  const [edit, setEdit] = useState(true);
  const [form] = Form.useForm();
  const { data: user, refetch } = useWhoAmIQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [requestToken] = useLazyCreateRequestTokenQuery();
  const [authorizeToken] = useLazyAuthorizeRequestTokenQuery();

  const [params, setParams] = useSearchParams();

  useEffect(() => {
    if (user) {
      const { email, username, tokenV4 } = user;
      form.setFieldsValue({ email, username, tokenV4 });
    }
  }, [form, user]);

  const handleSubmit = async () => {
    const username = form.getFieldValue('username');
    const body = { username };
    try {
      await updateProfile(body).unwrap();
      setEdit((prev) => !prev);
      message.success('Profile Updated');
    } catch (err: any) {
      message.error(err.data.message);
    }
  };

  const handleTmdbLogin = async () => {
    try {
      const newToken = await requestToken().unwrap();
      window.location.href = appConfig.tmdbRedirectUrl + newToken.request_token;
    } catch (err: any) {
      message.error(err.data.message);
    }
  };

  useEffect(() => {
    if (params.get('authorize')) {
      authorizeToken()
        .unwrap()
        .then((data) => {
          setParams({});
          refetch();
          message.success(data.message);
        });
    }
  }, [params]);

  return (
    <Row justify={'center'}>
      <Col span={14}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography.Title level={4}>Profile</Typography.Title>
          <Button onClick={() => setEdit((prev) => !prev)}>Edit</Button>
        </div>
        <Form
          layout="vertical"
          form={form}
          disabled={edit}
          onFinish={handleSubmit}
        >
          <Form.Item name="username" label="Name">
            <Input name="username" />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input name="email" />
          </Form.Item>
          <Form.Item
            name="tokenV4"
            label={
              <div
                style={{ display: 'flex', gap: '1em', alignItems: 'center' }}
              >
                <label>Tmdb Access Token</label>
                <Button onClick={handleTmdbLogin}>Login to TMDB</Button>
                <Button>Logout from TMDB</Button>
              </div>
            }
            help={
              'This app uses TMDB internally. To access all features please login to TMDB'
            }
          >
            <Input disabled name="tokenV4" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Profile;
