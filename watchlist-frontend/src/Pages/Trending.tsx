import { Button, Col, Row, Select, Typography, message } from 'antd';
import { MediaTypesEnum, MediaTypes } from '../interfaces';
import { useState, useEffect } from 'react';
import Title from '../components/Title';
import { useLazyTrendingQuery } from '../redux/apiSlices/searchSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { saveTrendingOptions } from '../redux/slices/stateSlice';

const { Option } = Select;

const Trending = () => {
  const { trending } = useAppSelector((state) => state.state);
  const [type, setType] = useState<MediaTypes>(trending.type as MediaTypes);
  const [window, setWindow] = useState<string>(trending.window);
  const [search, { data }] = useLazyTrendingQuery();

  const dispatch = useAppDispatch();

  const handleSearch = async () => {
    try {
      await search({
        type,
        window,
      }).unwrap();
    } catch (err: any) {
      console.log('error', err);
      message.error(err.data.message);
    }
  };

  useEffect(() => {
    if (type || window) {
      const timeout = setTimeout(() => handleSearch(), 500);
      return () => clearTimeout(timeout);
    }
  }, [type, window]);

  useEffect(() => {
    return () => {
      dispatch(saveTrendingOptions({ type, window }));
    };
  }, [type, window]);

  return (
    <Row>
      <Col span={24}>
        <Row gutter={20} align={'middle'}>
          <Col span={11}>
            <Typography.Title level={2} style={{ margin: '0' }}>
              Trending
            </Typography.Title>
          </Col>
          <Col span={5}>
            <Select
              placeholder="Title Type"
              defaultValue={type}
              value={type}
              onChange={(value) => setType(value)}
              style={{ width: '100%' }}
            >
              <Option value={MediaTypesEnum.MULTI}>All</Option>
              <Option value={MediaTypesEnum.MOVIE}>Movie</Option>
              <Option value={MediaTypesEnum.TV}>Tv</Option>
              <Option value={MediaTypesEnum.PERSON}>Person</Option>
            </Select>
          </Col>

          <Col span={5}>
            <Select
              placeholder="Trend Window"
              defaultValue={window}
              value={window}
              onChange={(value) => setWindow(value)}
              style={{ width: '100%' }}
            >
              <Option value={'day'}>Day</Option>
              <Option value={'week'}>Week</Option>
            </Select>
          </Col>
          <Col span={3}>
            <Button
              type="primary"
              className="basic-btn"
              block
              onClick={() => handleSearch()}
            >
              Search
            </Button>
          </Col>
        </Row>
        <Row gutter={[25, 25]} style={{ marginTop: '1em' }}>
          {data &&
            data.results.length !== 0 &&
            data.results.map((d) => {
              let t = Object.assign({}, d);
              if (type !== 'multi') {
                t = Object.assign(t, { media_type: type });
              }
              return (
                <Col span={4} key={d.id}>
                  <Title data={t} />
                </Col>
              );
            })}
        </Row>
      </Col>
    </Row>
  );
};

export default Trending;
