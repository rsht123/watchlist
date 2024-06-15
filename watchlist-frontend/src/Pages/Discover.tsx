import {
  Button,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  message,
  Pagination,
  PaginationProps,
  Form,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { Dictionary, isEmpty, pickBy, startCase } from 'lodash';
import { useEffect, useState } from 'react';
import {
  useLazyDiscoverQuery,
  useLazySearchIdsQuery,
} from '../redux/apiSlices/searchSlice';
import Title from '../components/Title';
import { useAppDispatch, useAppSelector } from '../redux/store';
import {
  DateType,
  discoverFields,
  saveDiscoverFields,
} from '../redux/slices/stateSlice';

const { Option } = Select;

const Discover = () => {
  const { discover } = useAppSelector((state) => state.state);
  const [form] = Form.useForm();
  const [helperForm] = Form.useForm();
  const [searchValue, setSearchValue] = useState<string>('');
  const [selected, setSelected] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationProps>(
    discover.pagination
  );

  const [searchIds, { data: titles }] = useLazySearchIdsQuery();

  const [
    discoverSearch,
    { data, isLoading, isFetching, isSuccess, isUninitialized },
  ] = useLazyDiscoverQuery();

  const dispatch = useAppDispatch();

  const handleSearch = async () => {
    const fieldValues = form.getFieldsValue();
    const newValues = Object.assign({}, fieldValues);
    discoverFields
      .filter((t) => t.type === 'date')
      .forEach((f) => {
        const value = newValues[f.key] as DateType;
        if (f.key !== 'year' && value) {
          newValues[f.key] = dayjs(value)?.format('YYYY-MM-DD');
        } else if (value) {
          newValues[f.key] = dayjs(value)?.format('YYYY');
        }
      });
    const sendValues = pickBy(
      newValues,
      (value) => value && value !== ''
    ) as Dictionary<string | number>;

    sendValues.page = pagination.current ? pagination.current : 1;
    try {
      await discoverSearch(sendValues).unwrap();
      dispatch(saveDiscoverFields({ pagination, allFields: newValues }));
    } catch (err: any) {
      message.error(err.data.message);
    }
  };

  useEffect(() => {
    if (pagination && !isUninitialized) {
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
    if (discover.allFields && isUninitialized) {
      let year, release_dateGreater, release_dateLesser;

      year = discover.allFields.year;
      release_dateGreater = discover.allFields['release_date.gte'];
      release_dateLesser = discover.allFields['release_date.lte'];

      const newFields = Object.assign({}, discover.allFields, {
        year: !isEmpty(year) ? dayjs(year) : null,
        'release_date.gte': !isEmpty(release_dateGreater)
          ? dayjs(release_dateGreater)
          : null,
        'release_date.lte': !isEmpty(release_dateLesser)
          ? dayjs(release_dateLesser)
          : null,
      });
      form.setFieldsValue(newFields);
      handleSearch();
    }
  }, []);

  const handleHelperSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleAdd = () => {
    const data = helperForm.getFieldsValue();
    const currValue = form.getFieldValue(data.field);
    if (currValue.trim().length === 0) {
      form.setFieldValue(data.field, `${data.id}`);
    } else {
      form.setFieldValue(
        data.field,
        `${currValue}${data.operation === 'and' ? ',' : '|'}${data.id}`
      );
    }
    helperForm.resetFields();
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null;
    const field = helperForm.getFieldValue('field');
    const titleType = form.getFieldValue('titleType');
    if (!field && searchValue.length > 0) {
      return message.warning('Please select field value to search');
    }
    if (searchValue && searchValue.length !== 0) {
      timeout = setTimeout(() => {
        searchIds({ searchValue, field, titleType });
      }, 500);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchValue, searchIds]);

  return (
    <Row>
      <Col span={24}>
        <Row>
          <Form layout="inline" onFinish={handleSearch} form={form}>
            {discoverFields.map((field) => {
              return field.type === 'string' ? (
                <Col span={6} key={field.key}>
                  <Form.Item
                    className="discover-form-item"
                    label={startCase(field.key)}
                    name={field.key}
                  >
                    <Input placeholder={`Search ${startCase(field.key)}`} />
                  </Form.Item>
                </Col>
              ) : field.type === 'date' ? (
                <Col span={6} key={field.key}>
                  <Form.Item
                    label={startCase(field.key)}
                    className="discover-form-item"
                    name={field.key}
                  >
                    <DatePicker
                      style={{ display: 'block' }}
                      picker={field.key === 'year' ? 'year' : 'date'}
                      allowClear
                    />
                  </Form.Item>
                </Col>
              ) : (
                <Col span={6} key={field.key}>
                  <Form.Item
                    label={startCase(field.key)}
                    className="discover-form-item"
                    name={field.key}
                  >
                    <Select
                      style={{ width: '100%' }}
                      placeholder={`Select ${startCase(field.key)}`}
                    >
                      {field.options?.map((option) => (
                        <Option key={option} value={option}>
                          {startCase(option)}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              );
            })}
            <Col span={6} style={{ marginTop: 'auto' }}>
              <Form.Item>
                <Button
                  type="primary"
                  className="basic-btn"
                  block
                  htmlType="submit"
                >
                  Search
                </Button>
              </Form.Item>
            </Col>
          </Form>
        </Row>
        <Row style={{ margin: '1em 0' }}>
          <Typography.Text
            strong
            style={{
              display: 'grid',
              marginBottom: '0',
              placeItems: 'center',
              height: '100%',
              fontSize: '1.3em',
            }}
          >
            Search IDs
          </Typography.Text>
        </Row>
        <Row gutter={[0, 5]}>
          <Col span={24}>
            <Form layout="inline" form={helperForm}>
              <Col span={6}>
                <Form.Item
                  label="Field"
                  name="field"
                  className="discover-form-item"
                >
                  <Select>
                    {discoverFields
                      .filter((f) => f.help)
                      .map((field) => (
                        <Option key={field.key} value={field.key}>
                          {startCase(field.key)}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Operation"
                  name="operation"
                  className="discover-form-item"
                >
                  <Select>
                    <Option value="and">And</Option>
                    <Option value="or">Or</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Search"
                  name="id"
                  className="discover-form-item"
                >
                  <Select
                    showSearch
                    notFoundContent={null}
                    defaultActiveFirstOption={false}
                    suffixIcon={null}
                    value={selected}
                    allowClear
                    onSelect={(e) => setSelected(e)}
                    filterOption={false}
                    onSearch={handleHelperSearch}
                    options={(titles?.results || []).map((item) => ({
                      value: item.id,
                      label: `${item.name} (${item.id})`,
                    }))}
                  >
                    <Option value="hello">Hello</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} style={{ marginTop: 'auto' }}>
                <Form.Item label="" className="discover-form-item">
                  <Button
                    type="primary"
                    className="basic-btn"
                    block
                    htmlType="submit"
                    onClick={handleAdd}
                  >
                    Add
                  </Button>
                </Form.Item>
              </Col>
            </Form>
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
              t = Object.assign(t, {
                media_type: form.getFieldValue('titleType'),
              });
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

export default Discover;
