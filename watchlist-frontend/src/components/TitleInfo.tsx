import moment from 'moment';
import { Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { MediaTypesEnum } from '../interfaces';
import { appConfig } from '../appConfig';
import { MovieDetails } from '../interfaces/Movie';
import { TvDetails } from '../interfaces/Tv';
import { minutedToHours } from '../utils/utilFunctions';
import Genres from './Genres';
import ImdbInfo from './ImdbInfo';
import { useImdbRating } from '../hooks/useImdbRating';

const TitleInfo = ({ title }: { title: MovieDetails | TvDetails }) => {
  const getReleaseDate = () => {
    return title.media_type === MediaTypesEnum.MOVIE
      ? title.release_date
      : title.media_type === MediaTypesEnum.TV
      ? title.first_air_date
      : undefined;
  };

  useImdbRating([title.external_ids.imdb_id]);

  return (
    <div
      style={{
        margin: '1em',
        display: 'flex',
        flexDirection: 'column',
        gap: '1em',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
        <h3 style={{ margin: '0' }}>
          {title?.media_type === 'movie' ? title.title : title.name}
        </h3>
        <ImdbInfo
          imdb_id={title.external_ids.imdb_id}
          inline={true}
          full={false}
        />
        <div style={{ display: 'flex', gap: '.7em', alignItems: 'center' }}>
          <span>TMDB:</span>
          <Typography.Text strong>
            {title.vote_average.toFixed(1)}/10
          </Typography.Text>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1em',
          marginTop: '.5em',
        }}
      >
        <div>
          <Link
            to={`${appConfig.imdbBaseUrl}title/${title?.external_ids?.imdb_id}`}
            target="_blank"
          >
            <Button type="primary">IMDB</Button>
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5em' }}>
          <Link
            to={`${appConfig.tmdbBaseUrl}${title.media_type}/${title.id}`}
            target="_blank"
          >
            <Button type="primary">TMDB</Button>
          </Link>
        </div>
        <div>
          <Link
            to={`${appConfig.googleBaseUrl}${
              title.media_type === MediaTypesEnum.MOVIE
                ? title.title.split(' ').join('+')
                : title.name.split(' ').join('+')
            }`}
            target="_blank"
          >
            <Button type="primary">Google</Button>
          </Link>
        </div>
      </div>
      <p className="description">{title.overview}</p>
      {title.media_type === MediaTypesEnum.TV && (
        <p style={{ display: 'flex', gap: '1em' }}>
          <span>
            <strong>Status: </strong>
            {title.status}
          </span>
          {title.media_type === 'tv' && (
            <span>
              <strong>Seasons: </strong>
              {title.number_of_seasons}
            </span>
          )}
          {title.media_type === MediaTypesEnum.TV && (
            <span>
              <strong>Episodes: </strong>
              {title.number_of_episodes}
            </span>
          )}
        </p>
      )}
      <p style={{ display: 'flex', gap: '1em' }}>
        <span>
          <strong>Released:</strong> {moment(getReleaseDate()).format('ll')}
        </span>
        <span>
          <strong>Runtime: </strong>
          {title.media_type === MediaTypesEnum.MOVIE
            ? minutedToHours(title.runtime)
            : minutedToHours(
                title.episode_run_time[0] || title.last_episode_to_air.runtime
              )}
        </span>
        <span>
          <strong>Language: </strong>
          {title.original_language}
        </span>
        <span>
          <strong>Adult: </strong>
          <span style={{ textTransform: 'capitalize' }}>
            {title.adult.toString()}
          </span>
        </span>
      </p>
      <Genres
        genres={title.genres}
        keywords={
          title.media_type === MediaTypesEnum.MOVIE
            ? title.keywords.keywords
            : title.keywords.results
        }
      />
      {/* TODO: add account states */}
      {/* <AccountStates title={title} /> */}
    </div>
  );
};

export default TitleInfo;
