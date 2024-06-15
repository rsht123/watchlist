import { useParams } from 'react-router-dom';
import { useFetchEpisodeDetailsQuery } from '../redux/apiSlices/titleSlice';
import Loader from '../components/Loader';
import SeasonInfo from '../components/SeasonInfo';
import CastInfoNew from '../components/CastInfoNew';
import { MediaTypesEnum } from '../interfaces';
import { Episode, SeasonInfoEnum } from '../interfaces/Tv';

const EpisodePage = () => {
  const { media_id, season_number, episode_number } = useParams();

  const { data: episode, isSuccess } = useFetchEpisodeDetailsQuery({
    media_id: media_id!,
    season_number: season_number!,
    episode_number: episode_number!,
  });

  if (!isSuccess) {
    return <Loader />;
  }

  const newEpisode = {
    ...episode,
    info_type: SeasonInfoEnum.EPISODE,
  } as Episode;

  return (
    <div>
      <SeasonInfo data={newEpisode} />
      <CastInfoNew
        media_type={MediaTypesEnum.EPISODE}
        credits={{ cast: episode.guest_stars, crew: episode.crew }}
      />
    </div>
  );
};

export default EpisodePage;
