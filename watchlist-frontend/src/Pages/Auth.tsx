import { Outlet } from 'react-router-dom';
import { Layout, Typography, Row, Col } from 'antd';

const { Content, Footer } = Layout;

const Auth = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content
        style={{
          display: 'grid',
        }}
      >
        <Row align={'middle'} justify={'center'} style={{ height: '100%' }}>
          <Col span={6}>
            <Outlet />
          </Col>
        </Row>
      </Content>
      <Footer
        style={{
          height: '3em',
          display: 'grid',
          placeItems: 'center',
          padding: '0',
          backgroundColor: 'rgb(16, 142, 233)',
          marginTop: '1em',
        }}
      >
        <Typography.Text style={{ color: '#FFF' }}>
          &copy; 2023 Rishit Rathod
        </Typography.Text>
      </Footer>
    </Layout>
  );
};

export default Auth;
