import { useEffect, useState } from 'react';
import {
  Alert,
  Card,
  Col,
  Form,
  Pagination,
  PaginationProps,
  Row,
  Select,
  Typography,
} from 'antd';
import Title from '../components/Title';
import { useParams } from 'react-router-dom';
import { useFetchListQuery } from '../redux/apiSlices/accountSlice';
import { startCase } from 'lodash';
import { appConfig } from '../appConfig';
import ImageComponent from '../components/ImageComponent';
import { Media } from '../interfaces';

const { Option } = Select;

const sortOptions = [
  'primary_release_date.desc',
  'primary_release_date.asc',
  'origianl_order.desc',
  'original_order.asc',
  'vote_average.desc',
  'vote_average.asc',
  'title.desc',
  'title.asc',
];

const ListDetails = () => {
  const { listId } = useParams();
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    total: 21,
    pageSize: 20,
  });
  const { data, isLoading, isFetching, isSuccess, refetch } = useFetchListQuery(
    {
      listId: listId ? listId : '',
      page: pagination.current ? pagination.current : 1,
    }
  );

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

  return (
    <Row>
      <Col span={24}>
        <Row style={{ height: 'auto' }}>
          <Col span={24}>
            <Card style={{ overflow: 'hidden' }} bodyStyle={{ padding: '0' }}>
              <Row gutter={20} justify={'start'}>
                <Col>
                  <ImageComponent
                    size={appConfig.listEpisodeImageSize}
                    path={data?.backdrop_path}
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                </Col>
                <Col>
                  <Typography.Title level={2} style={{ marginTop: '1em' }}>
                    {data?.name} ({data?.total_results})
                  </Typography.Title>
                  <Typography.Paragraph>
                    {data?.description}
                  </Typography.Paragraph>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row style={{ margin: '.5em 0' }}>
          <Col span={24}>
            <Alert
              type="info"
              showIcon
              message={
                'Hint: Right click on a title to set it as the list image'
              }
            />
          </Col>
        </Row>
        <Row style={{ margin: '1em 0' }} justify={'space-between'}>
          <Col span={7}>
            <Form.Item label="Sort By" style={{ margin: '0 0 .5em' }}>
              <Select placeholder="Sort By" style={{ width: '100%' }}>
                {sortOptions.map((option) => (
                  <Option key={option} value={option}>
                    {startCase(option)}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
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
        <Row gutter={[25, 25]} style={{ marginTop: '1em' }} justify={'start'}>
          {data &&
            data.results.length !== 0 &&
            data.results.map((d) => {
              d = Object.assign({}, d) as Media;
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

export default ListDetails;
