import { Card, Typography } from 'antd';
import moment from 'moment';
import { Media, MediaTypesEnum } from '../interfaces';
import { useNavigate } from 'react-router-dom';
import ImageComponent from './ImageComponent';

// TODO: check navigation
const Title = ({
  data,
  titleId,
  handleMovieClick,
  handleSeasonClick,
}: {
  data: Media;
  titleId?: number;
  handleMovieClick?: (media_id: number) => void;
  handleSeasonClick?: (season_number: number) => void;
}) => {
  const navigate = useNavigate();

  const getPosterPath = () => {
    switch (data.media_type) {
      case MediaTypesEnum.MOVIE:
      case MediaTypesEnum.TV:
      case MediaTypesEnum.COLLECTION:
        return data.poster_path;
      case MediaTypesEnum.PERSON:
        return data.profile_path;
      case MediaTypesEnum.COMPANY:
        return data.logo_path;
      case MediaTypesEnum.LIST:
        return data.backdrop_path;
      case MediaTypesEnum.COLLECTION_DETAILS:
        return data.poster_path;
      case MediaTypesEnum.SEASON:
        return data.poster_path;
      default:
        return undefined;
    }
  };

  const handleNavigation = () => {
    if (data.media_type === MediaTypesEnum.SEASON) {
      if (handleSeasonClick) {
        handleSeasonClick(data.season_number);
      } else {
        navigate(`/title/seasons/${titleId}`, {
          state: { season_number: data.season_number },
        });
      }
    } else if (data.media_type === MediaTypesEnum.LIST) {
      navigate(`/user-lists/${data.id}`);
    } else if (data.media_type === MediaTypesEnum.COLLECTION) {
      navigate(`/title/collection/${data.id}`);
    } else if (
      data.media_type === MediaTypesEnum.MOVIE ||
      data.media_type === MediaTypesEnum.TV
    ) {
      if (handleMovieClick) {
        handleMovieClick(data.id);
      } else {
        navigate(`/title/${data.media_type}/${data.id}`);
      }
    }
  };

  const getDate = () => {
    const media_type = data.media_type;
    let date;
    if (media_type === MediaTypesEnum.TV) {
      date = data.first_air_date;
    } else if (media_type === MediaTypesEnum.MOVIE) {
      date = data.release_date;
    } else if (media_type === MediaTypesEnum.LIST) {
      date = data.updated_at;
    }
    if (date) {
      return moment(date).format('ll');
    } else {
      return null;
    }
  };

  const showExtraInfo = () => {
    const media_type = data.media_type;
    if (
      media_type === MediaTypesEnum.MOVIE ||
      media_type === MediaTypesEnum.TV
    ) {
      return `Rating: ${data.vote_average}`;
    } else if (media_type === MediaTypesEnum.PERSON) {
      return `Popularity: ${data.popularity}`;
    } else if (media_type === MediaTypesEnum.SEASON) {
      return `Episodes: ${data.episode_count}`;
    } else {
      return null;
    }
  };

  return (
    <Card
      style={{
        textAlign: 'center',
        cursor:
          data.media_type === MediaTypesEnum.COLLECTION_DETAILS
            ? 'default'
            : 'pointer',
        flex: 'unset',
        boxShadow: '0 2px 8px rgba(0,0,0,.1)',
        position: 'relative',
        height: '100%',
      }}
      bodyStyle={{
        padding: '0',
        borderRadius: '8px 8px 0 0',
        overflow: 'hidden',
      }}
      bordered={false}
      onClick={handleNavigation}
    >
      <ImageComponent
        size="original"
        path={getPosterPath()}
        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
      />
      <div style={{ padding: '.5em 1em 1em' }}>
        <div>
          <Typography.Title
            level={5}
            ellipsis={{ tooltip: true }}
            style={{ margin: '0' }}
          >
            {data.media_type === MediaTypesEnum.MOVIE ? data.title : data.name}
            {data.media_type === MediaTypesEnum.LIST
              ? ` (${data.number_of_items})`
              : null}
          </Typography.Title>
          <div>
            {getDate()}
            {data.media_type === MediaTypesEnum.PERSON
              ? `Department: ${data.known_for_department}`
              : null}
          </div>
          <div>
            <Typography.Text strong>{showExtraInfo()}</Typography.Text>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Title;
