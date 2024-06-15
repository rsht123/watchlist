import { FC, useRef } from 'react';
import { AdditionalInfoQuery } from '../interfaces/Title';
import Title from './Title';
import { Col, Typography } from 'antd';
import useOnScreen from '../hooks/useOnScreen';

const AdditionalTitleInfo: FC<AdditionalInfoQuery> = ({
  titles,
  info_type,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);

  return (
    <div ref={ref} style={!isVisible ? { paddingTop: '1em' } : {}}>
      {isVisible && (
        <>
          <Typography.Title level={3}>
            {info_type === 'recommendations' ? 'Similar' : 'Similar'}
          </Typography.Title>
          <div
            style={{
              padding: '1em 0',
              display: 'flex',
              gap: '1em',
              width: '100%',
              overflow: 'auto',
            }}
          >
            {titles.map((data) => {
              return (
                <Col span={4} md={4} sm={6} xs={12} key={data.id}>
                  <Title data={data} />
                </Col>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default AdditionalTitleInfo;
