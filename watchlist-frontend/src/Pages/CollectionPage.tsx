import { useLocation, useParams } from 'react-router-dom';
import { useFetchCollectionQuery } from '../redux/apiSlices/titleSlice';
import Loader from '../components/Loader';
import { Col, Row } from 'antd';
import { MediaTypesEnum } from '../interfaces';
import Title from '../components/Title';
import TitlePage from './TitlePage';
import { useEffect, useState } from 'react';

const CollectionPage = () => {
  const { collection_id } = useParams();

  const {
    data: collection,
    isLoading,
    isFetching,
    isSuccess,
  } = useFetchCollectionQuery(parseInt(collection_id!));

  const [mediaId, setMediaId] = useState<number | null>(null);
  const { state } = useLocation();

  useEffect(() => {
    if (collection && isSuccess) {
      setMediaId(state?.movieId ? state?.movieId : collection.parts[0].id);
    }
  }, [collection, isSuccess]);

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (!isSuccess) {
    return <Loader />;
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '1em',
      }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <strong style={{ marginRight: '.5em' }}>Collection:</strong>
        <p>{`${collection.name} (${collection.parts.length})`}</p>
      </div>
      <div>
        <Row gutter={[25, 25]} style={{ marginTop: '1em' }}>
          <Col md={4} xs={3}>
            <Title data={collection} />
          </Col>
          {collection.parts.map((movie) => (
            <Col md={4} xs={3} key={movie.id}>
              <Title data={movie} handleMovieClick={(id) => setMediaId(id)} />
            </Col>
          ))}
        </Row>
      </div>
      {mediaId && (
        <TitlePage media_type={MediaTypesEnum.MOVIE} media_id={`${mediaId}`} />
      )}
    </div>
  );
};

export default CollectionPage;
