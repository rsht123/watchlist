import {
  Button,
  Col,
  Pagination,
  PaginationProps,
  Row,
  Select,
  Typography,
  message,
} from 'antd';
import {
  ListTitleOptionKeys,
  Media,
  MediaTypesEnum,
  Options,
} from '../interfaces';
import Title from '../components/Title';
import { useEffect, useState } from 'react';
import { useLazyAllListsQuery } from '../redux/apiSlices/searchSlice';
import { startCase, snakeCase, lowerCase } from 'lodash';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { saveListOptions } from '../redux/slices/stateSlice';

const { Option } = Select;

const optionValues: Options = {
  movie: ['popular', 'now playing', 'top rated', 'upcoming'],
  tv: ['airing today', 'on the air', 'popular', 'top rated'],
  person: ['popular'],
};

const Titles = () => {
  const { lists } = useAppSelector((state) => state.state);
  const [type, setType] = useState<ListTitleOptionKeys>(
    lists.type as ListTitleOptionKeys
  );
  const [listType, setListType] = useState<string>(lists.listType);
  const [pagination, setPagination] = useState<PaginationProps>(
    lists.pagination
  );

  const [search, { data, isLoading, isFetching, isSuccess }] =
    useLazyAllListsQuery();

  const dispatch = useAppDispatch();

  const handleSetType = (value: ListTitleOptionKeys) => {
    setType(value);
    if (optionValues[value].indexOf(lowerCase(listType)) === -1) {
      setListType('popular');
    }
  };

  const handleSearch = async (current?: number) => {
    try {
      await search({
        type,
        listType,
        page: current ? current : pagination.current ? pagination.current : 1,
      }).unwrap();
    } catch (err: any) {
      console.log('error', err);
      message.error(err.data.message);
    }
  };

  useEffect(() => {
    if (type || listType) {
      handleSearch(1);
    }
  }, [type, listType]);

  useEffect(() => {
    if (pagination) {
      handleSearch();
    }
  }, [pagination]);

  useEffect(() => {
    if (
      (data?.page !== pagination.current ||
        data?.total_results !== pagination.total) &&
      isSuccess &&
      !isLoading &&
      !isFetching
    ) {
      setPagination((prev) => ({
        ...prev,
        current: data?.page,
        total: data?.total_results,
      }));
    }
  }, [data]);

  useEffect(() => {
    return () => {
      dispatch(saveListOptions({ pagination, type, listType }));
    };
  }, [pagination, type, listType]);

  return (
    <Row>
      <Col span={24}>
        <Row gutter={20} align={'middle'}>
          <Col span={11}>
            <Typography.Title level={2} style={{ margin: '0' }}>
              Common Lists
            </Typography.Title>
          </Col>
          <Col span={5}>
            <Select
              placeholder="Title Type"
              defaultValue={type}
              value={type}
              onChange={handleSetType}
              style={{ width: '100%' }}
            >
              <Option value={MediaTypesEnum.MOVIE}>Movie</Option>
              <Option value={MediaTypesEnum.TV}>Tv</Option>
              <Option value={MediaTypesEnum.PERSON}>Person</Option>
            </Select>
          </Col>

          <Col span={5}>
            <Select
              placeholder="Trend Window"
              value={listType}
              onChange={(value) => setListType(value)}
              style={{ width: '100%' }}
            >
              {optionValues[type].map((option) => (
                <Option key={snakeCase(option)} value={snakeCase(option)}>
                  {startCase(option)}
                </Option>
              ))}
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
        <Row style={{ margin: '1em 0' }} justify={'end'}>
          <Col>
            <Pagination
              showTotal={(total) => <strong>{`Total: ${total}`}</strong>}
              total={pagination.total}
              hideOnSinglePage
              current={pagination.current}
              pageSize={pagination.pageSize}
              onChange={(page) =>
                setPagination((prev) => ({ ...prev, current: page }))
              }
              showSizeChanger={false}
            />
          </Col>
        </Row>
        <Row gutter={[25, 25]} style={{ marginTop: '1em' }}>
          {data &&
            data.results.length !== 0 &&
            data.results.map((d) => {
              d = { ...d, media_type: type } as Media;
              return (
                <Col span={4} key={d.id}>
                  <Title data={d} />
                </Col>
              );
            })}
        </Row>
        <Row style={{ margin: '1em 0' }} justify={'end'}>
          <Col>
            <Pagination
              showTotal={(total) => <strong>{`Total: ${total}`}</strong>}
              total={pagination.total}
              hideOnSinglePage
              current={pagination.current}
              pageSize={pagination.pageSize}
              onChange={(page) =>
                setPagination((prev) => ({ ...prev, current: page }))
              }
              showSizeChanger={false}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Titles;
