import { useState, useEffect } from 'react';
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
import { MediaTypesEnum, MediaTypes } from '../interfaces';
import { useLazyFetchFavoritesQuery } from '../redux/apiSlices/accountSlice';
import Title from '../components/Title';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { saveFavoriteOptions } from '../redux/slices/stateSlice';

const { Option } = Select;

const Favorites = () => {
  const { favorite } = useAppSelector((state) => state.state);
  const { user } = useAppSelector((state) => state.user);
  const [type, setType] = useState<MediaTypes>(favorite.type as MediaTypes);
  const [pagination, setPagination] = useState<PaginationProps>(
    favorite.pagination
  );
  const [search, { data, isLoading, isFetching, isSuccess }] =
    useLazyFetchFavoritesQuery();

  const dispatch = useAppDispatch();

  const handleSearch = async (current?: number) => {
    try {
      let newType = type === MediaTypesEnum.MOVIE ? 'movies' : 'tv';
      await search({
        type: newType,
        page: current ? current : pagination.current ? pagination.current : 1,
      }).unwrap();
    } catch (err: any) {
      console.log('error', err);
      if (user?.tokenV4) {
        message.error(err.data.message);
      }
    }
  };

  useEffect(() => {
    if (type) {
      handleSearch(1);
    }
  }, [type]);

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
      dispatch(saveFavoriteOptions({ type, pagination }));
    };
  }, [type, pagination]);

  if (!user?.tokenV4) {
    return (
      <div style={{ textAlign: 'center' }}>
        Please login through tmdb in the profile to access this feature.
      </div>
    );
  }

  return (
    <Row>
      <Col span={24}>
        <Row gutter={20} align={'middle'}>
          <Col span={15}>
            <Typography.Title level={2} style={{ margin: '0' }}>
              Favorites
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
              <Option value={MediaTypesEnum.MOVIE}>Movie</Option>
              <Option value={MediaTypesEnum.TV}>Tv</Option>
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
              let t = Object.assign({}, d);
              t = Object.assign(t, { media_type: type });
              return (
                <Col span={4} key={d.id}>
                  <Title data={t} />
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

export default Favorites;
