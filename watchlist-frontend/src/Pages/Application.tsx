/// <reference types="vite-plugin-svgr/client" />
import { Col, Dropdown, Layout, Row, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MdAccountCircle } from 'react-icons/md';
import { signout } from '../redux/slices/userSlice';
import { useAppDispatch } from '../redux/store';
import TMDBLogo from '../assets/tmdb-logo.svg?react';

const { Header, Content, Footer } = Layout;

const Application: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = [
    {
      key: '0',
      label: 'Profile',
      onClick: () => {
        navigate('/profile');
      },
    },
    {
      key: '1',
      label: 'Logout',
      onClick: () => {
        dispatch(signout(null));
        window.location.reload();
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          background: 'white',
          boxShadow: '0 0 8px 6px rgba(0,0,0,0.1)',
          width: '100%',
          justifyContent: 'space-between',
          display: 'flex',
          alignItems: 'center',
        }}
        className="d-flex"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '2em' }}>
          <Typography.Title
            level={3}
            style={{ color: 'rgba(0, 0, 0, 0.6)', margin: '0' }}
          >
            Watchlist Manager
          </Typography.Title>
          <div style={{ display: 'grid', gridAutoFlow: 'column', gap: '1em' }}>
            <Typography.Text
              rootClassName={`nav-tabs ${
                pathname.indexOf('search') !== -1 ? 'active' : ''
              }`}
              strong
              onClick={() => navigate('/search')}
            >
              Search
            </Typography.Text>
            <Typography.Text
              rootClassName={`nav-tabs ${
                pathname.indexOf('discover') !== -1 ? 'active' : ''
              }`}
              strong
              onClick={() => navigate('/discover')}
            >
              Discover
            </Typography.Text>
            <Typography.Text
              rootClassName={`nav-tabs ${
                pathname.indexOf('trending') !== -1 ? 'active' : ''
              }`}
              strong
              onClick={() => navigate('/trending')}
            >
              Trending
            </Typography.Text>
            <Typography.Text
              rootClassName={`nav-tabs ${
                pathname === '/lists' ? 'active' : ''
              }`}
              strong
              onClick={() => navigate('/lists')}
            >
              Lists
            </Typography.Text>
            <Typography.Text
              rootClassName={`nav-tabs ${
                pathname.indexOf('user-lists') !== -1 ? 'active' : ''
              }`}
              strong
              onClick={() => navigate('/user-lists')}
            >
              My Lists
            </Typography.Text>
            <Typography.Text
              rootClassName={`nav-tabs ${
                pathname.indexOf('watchlist') !== -1 ? 'active' : ''
              }`}
              strong
              onClick={() => navigate('/watchlist')}
            >
              Watchlist
            </Typography.Text>
            <Typography.Text
              rootClassName={`nav-tabs ${
                pathname.indexOf('favorites') !== -1 ? 'active' : ''
              }`}
              strong
              onClick={() => navigate('/favorites')}
            >
              Favorites
            </Typography.Text>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4em', alignItems: 'center' }}>
          <div
            style={{
              justifySelf: 'end',
              alignSelf: 'center',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <TMDBLogo style={{ height: '2em', width: 'auto' }} />
          </div>
          <Dropdown menu={{ items }} placement="bottomRight">
            <MdAccountCircle
              style={{
                height: '2em',
                width: '2em',
                fill: 'rgba(0, 0, 0, 0.6)',
              }}
            />
          </Dropdown>
        </div>
      </Header>
      <Content>
        <Row
          align={'middle'}
          justify={'center'}
          style={{ height: '100%', margin: '1em' }}
        >
          <Col span={20}>
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
          zIndex: 99999999,
        }}
      >
        <Typography.Text style={{ color: '#FFF' }}>
          &copy; 2023 Rishit Rathod
        </Typography.Text>
      </Footer>
    </Layout>
  );
};

export default Application;
