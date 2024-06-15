import { Typography } from 'antd';
import { appConfig } from '../appConfig';
import { useFetchCreditDetailsQuery } from '../redux/apiSlices/titleSlice';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import PersonInfo from '../components/PersonInfo';
import ImageComponent from '../components/ImageComponent';
import { MediaTypesEnum } from '../interfaces';
import CollectionComponent from '../components/Collection';
import Episodes from '../components/Episodes';
import { useEffect, useState } from 'react';
import { Episode } from '../interfaces/Tv';
import get from 'lodash/get';

const CreditPage = () => {
  const { credit_id } = useParams();

  const { data: credit, isSuccess } = useFetchCreditDetailsQuery(credit_id!);
  const [seasonNumber, setSeasonNumber] = useState<number | null>(null);

  const handleSeasonClick = (season_number: number): void => {
    setSeasonNumber(season_number);
  };

  useEffect(() => {
    if (credit?.media?.seasons) {
      setSeasonNumber(get(credit, `media.seasons.0.season_number`));
    }
  }, [credit]);

  if (!isSuccess) {
    return <Loader />;
  }

  return (
    <div>
      <header
        style={{
          marginTop: '2em',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '2em',
          position: 'relative',
          borderRadius: '10px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div
            style={{
              display: 'grid',
              gap: '1em',
              gridTemplateColumns: 'auto 1fr',
            }}
          >
            <ImageComponent
              size={appConfig.listEpisodeImageSize}
              path={credit.person.profile_path}
              style={{
                boxShadow: '0 0 10px 2px rgba(0,0,0,0.1)',
                borderRadius: '5px',
              }}
            />
            <PersonInfo person={credit.person} />
          </div>
          <div
            style={{
              display: 'grid',
              gap: '1em',
              gridTemplateColumns: '1fr auto',
            }}
          >
            <div>
              <Typography.Title level={3}>
                {credit.media.name ? credit.media.name : credit.media.title}
              </Typography.Title>
              <Typography.Paragraph>
                {credit.media.overview}
              </Typography.Paragraph>
              <Typography.Text strong>
                Character: {credit.media.character}
              </Typography.Text>
            </div>
            <ImageComponent
              size={appConfig.listEpisodeImageSize}
              path={credit.media.poster_path}
              style={{
                boxShadow: '0 0 10px 2px rgba(0,0,0,0.1)',
                borderRadius: '5px',
              }}
            />
          </div>
        </div>
      </header>
      {credit.media.media_type === MediaTypesEnum.TV && (
        <main>
          <CollectionComponent
            seasons={credit.media.seasons}
            titleId={credit.media.id}
            handleSeasonClick={handleSeasonClick}
          />
          <Episodes
            episodes={credit.media.episodes.filter(
              (ep: Episode) => ep.season_number === seasonNumber
            )}
          />
        </main>
      )}
    </div>
  );
};

export default CreditPage;
