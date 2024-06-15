import { FC, useEffect, useState } from 'react';
import Title from './Title';
import { useLazyFetchCollectionQuery } from '../redux/apiSlices/titleSlice';
import Loader from './Loader';
import { MediaTypesEnum } from '../interfaces';
import { CollectionDetails } from '../interfaces/Collection';
import { Col, Row } from 'antd';
import { Season } from '../interfaces/Tv';

type CollectionType =
  | CollectionTypesEnum.COLLECTION
  | CollectionTypesEnum.SEASONS;

enum CollectionTypesEnum {
  COLLECTION = 'collection',
  SEASONS = 'seasons',
}

const CollectionComponent: FC<{
  collectionId?: number;
  seasons?: Season[];
  titleId?: number;
  handleSeasonClick?: (season_number: number) => void;
}> = ({ collectionId, seasons, titleId, handleSeasonClick }) => {
  const [type, setType] = useState<CollectionType | null>(null);
  const [fetchCollection, { data, isSuccess, isLoading, isFetching }] =
    useLazyFetchCollectionQuery();

  useEffect(() => {
    if (collectionId) {
      setType(CollectionTypesEnum.COLLECTION);
      fetchCollection(collectionId);
    } else {
      setType(CollectionTypesEnum.SEASONS);
    }
  }, [collectionId, seasons]);

  if (!type) {
    return <Loader />;
  }

  if (type === CollectionTypesEnum.COLLECTION && (isFetching || isLoading)) {
    return <Loader />;
  }

  if (type === CollectionTypesEnum.COLLECTION && !isSuccess) {
    return <Loader />;
  }

  const collection = {
    ...data,
    media_type: MediaTypesEnum.COLLECTION_DETAILS,
  } as CollectionDetails;

  return (
    <div style={{ margin: '1em 0' }}>
      {type === CollectionTypesEnum.COLLECTION && (
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <strong style={{ marginRight: '.5em' }}>
            Collection: {`(${collection.parts.length})`}
          </strong>
          <p>{collection.name}</p>
        </div>
      )}
      {type === CollectionTypesEnum.SEASONS && (
        <div>
          <h2 style={{ marginRight: '.5em' }}>
            Seasons {`(${seasons?.length})`}
          </h2>
        </div>
      )}
      {type === CollectionTypesEnum.COLLECTION && (
        <Row gutter={[25, 25]} style={{ marginTop: '1em' }}>
          <Col md={4} xs={3}>
            <Title data={collection} />
          </Col>
          {collection.parts.map((movie) => (
            <Col md={4} xs={3} key={movie.id}>
              <Title data={movie} />
            </Col>
          ))}
        </Row>
      )}
      {type === CollectionTypesEnum.SEASONS && (
        <div
          style={{
            padding: '1em 0',
            display: 'flex',
            gap: '1em',
            width: '100%',
            overflow: 'auto',
          }}
        >
          {seasons?.map((season: Season) => {
            const newSeason = {
              ...season,
              media_type: MediaTypesEnum.SEASON,
            } as Season;
            return (
              <Col md={4} xs={3} key={newSeason.id}>
                <Title
                  data={newSeason}
                  titleId={titleId}
                  handleSeasonClick={handleSeasonClick}
                />
              </Col>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CollectionComponent;
