import { Typography } from 'antd';
import { Person } from '../interfaces/Person';

// TODO: Check Type
const PersonInfo = ({ person }: { person: Person }) => {
  return (
    <div
      style={{
        margin: '1em',
        display: 'flex',
        flexDirection: 'column',
        gap: '1em',
      }}
    >
      {/* <div style={{ whiteSpace: 'pre' }}>{JSON.stringify(person, null, 2)}</div> */}
      <Typography.Title level={3} style={{ margin: '0' }}>
        {person.name}
      </Typography.Title>
      <Typography.Title level={4} style={{ margin: '0' }}>
        Department: {person.known_for_department}
      </Typography.Title>
      <Typography.Paragraph className="">
        {person.biography}
      </Typography.Paragraph>
      <Typography.Text strong>Popularity: {person.popularity}%</Typography.Text>
    </div>
  );
};

export default PersonInfo;
