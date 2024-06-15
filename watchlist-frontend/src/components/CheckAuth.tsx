import Loader from './Loader';

const CheckAuth: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        height: '100vh',
        width: '100vw',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Loader />
    </div>
  );
};

export default CheckAuth;
