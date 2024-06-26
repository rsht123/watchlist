import {
  Button,
  Col,
  Pagination,
  PaginationProps,
  Row,
  Typography,
} from 'antd';
import {
  useCreateListMutation,
  useDeleteListMutation,
  useFetchAccountListsQuery,
} from '../redux/apiSlices/accountSlice';
import Title from '../components/Title';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { saveUserListsOptions } from '../redux/slices/stateSlice';
import { Media } from '../interfaces';
import CreateList from '../components/CreateList';

const Lists = () => {
  const { userLists } = useAppSelector((state) => state.state);
  const { user } = useAppSelector((state) => state.user);
  const [createListModal, setCreateListModal] = useState(false);
  const [pagination, setPagination] = useState<PaginationProps>(
    userLists.pagination
  );

  const { data, isLoading, isFetching, isSuccess, refetch } =
    useFetchAccountListsQuery(pagination.current || 1);

  const [createList] = useCreateListMutation();

  const [deleteList] = useDeleteListMutation();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (pagination) {
      refetch();
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
      dispatch(saveUserListsOptions({ pagination }));
    };
  }, [pagination]);

  const handleCreateList = async (name: string, desc: string) => {
    setCreateListModal(false);
    console.log({ name, desc });
    await createList({ name, desc }).unwrap();
    refetch();
  };

  const handleDeleteList = async (media_id: number) => {
    console.log(media_id);
    await deleteList(media_id).unwrap();
    refetch();
  };

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
          <Col span={22}>
            <Typography.Title level={2} style={{ margin: '0' }}>
              My Lists
            </Typography.Title>
          </Col>
          <Col span={2}>
            <Button type="primary" onClick={() => setCreateListModal(true)}>
              Create List
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
              d = { ...d, media_type: 'list' } as Media;
              return (
                <Col span={6} key={d.id}>
                  <Title data={d} handleDeleteList={handleDeleteList} />
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
      <CreateList
        open={createListModal}
        onClose={() => setCreateListModal(false)}
        createList={handleCreateList}
      />
    </Row>
  );
};

export default Lists;
