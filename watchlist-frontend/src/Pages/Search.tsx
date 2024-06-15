import {
  Button,
  Col,
  Input,
  Pagination,
  PaginationProps,
  Row,
  Select,
  message,
} from 'antd';
import { useState, useEffect } from 'react';
import { useLazySearchQuery } from '../redux/apiSlices/searchSlice';
import Title from '../components/Title';
import { MediaTypesEnum, MediaTypes, Media } from '../interfaces';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { saveSearchPagination } from '../redux/slices/stateSlice';

const { Option } = Select;

const Search = () => {
  const {
    search: {
      pagination: searchPagination,
      searchType: initialType,
      searchQuery: initialQuery,
    },
  } = useAppSelector((state) => state.state);
  const [searchType, setSearchType] = useState<MediaTypes>(initialType);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [search, { data, isLoading, isFetching, isSuccess }] =
    useLazySearchQuery();
  const [pagination, setPagination] =
    useState<PaginationProps>(searchPagination);

  const dispatch = useAppDispatch();

  const handleSearch = async (current?: number) => {
    try {
      await search({
        searchQuery,
        searchType,
        page: current ? current : pagination.current ? pagination.current : 1,
      }).unwrap();
    } catch (err: any) {
      console.log('error', err);
      message.error(err.data.message);
    }
  };

  useEffect(() => {
    if ((searchQuery && searchQuery.length !== 0) || searchType) {
      const timeout = setTimeout(() => handleSearch(1), 500);
      return () => clearTimeout(timeout);
    }
  }, [searchQuery, searchType]);

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
      dispatch(saveSearchPagination({ pagination, searchType, searchQuery }));
    };
  }, [pagination, searchQuery, searchType]);

  return (
    <Row>
      <Col span={24}>
        <Row gutter={20}>
          <Col span={16}>
            <Input
              placeholder="Search Query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
          </Col>
          <Col span={5}>
            <Select
              placeholder="Search Type"
              defaultValue={searchType}
              value={searchType}
              onChange={(value) => setSearchType(value)}
              style={{ width: '100%' }}
            >
              <Option value={MediaTypesEnum.MULTI}>Multi</Option>
              <Option value={MediaTypesEnum.MOVIE}>Movie</Option>
              <Option value={MediaTypesEnum.TV}>Tv</Option>
              <Option value={MediaTypesEnum.PERSON}>Person</Option>
              <Option value={MediaTypesEnum.COLLECTION}>Collection</Option>
              <Option value={MediaTypesEnum.COMPANY}>Company</Option>
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
            data.results.map((data) => {
              if (searchType !== MediaTypesEnum.MULTI) {
                data = { ...data, media_type: searchType } as Media;
              }
              return (
                <Col span={4} md={4} sm={6} xs={12} key={data.id}>
                  <Title data={data} />
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

export default Search;
