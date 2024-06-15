import { Typography } from 'antd';
import { Episode, SeasonInfoEnum } from '../interfaces/Tv';
import SeasonInfo from './SeasonInfo';
import { useImdbRating } from '../hooks/useImdbRating';

const Episodes = ({ episodes }: { episodes: Episode[] }) => {
  const episode_imdb_ids = episodes.map((episode) => episode.imdb_id);

  useImdbRating(episode_imdb_ids);

  return (
    <div>
      <Typography.Title level={3}>Episodes</Typography.Title>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        {episodes.map((episode: Episode) => {
          const new_episode = {
            ...episode,
            info_type: SeasonInfoEnum.EPISODE,
          } as Episode;
          return <SeasonInfo key={episode.id} data={new_episode} />;
        })}
      </div>
    </div>
  );
};

export default Episodes;
