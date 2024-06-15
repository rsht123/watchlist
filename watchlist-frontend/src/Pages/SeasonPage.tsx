import { useLocation, useParams } from 'react-router-dom';
import CollectionComponent from '../components/Collection';
import {
  useFetchSeasonQuery,
  useFetchTitleQuery,
} from '../redux/apiSlices/titleSlice';
import { MediaTypesEnum } from '../interfaces';
import Loader from '../components/Loader';
import Seasoninfo from '../components/SeasonInfo';
import { SeasonDetails, SeasonInfoEnum } from '../interfaces/Tv';
import Episodes from '../components/Episodes';
import { Typography } from 'antd';
import { cloneDeep } from 'lodash';

const SeasonPage = () => {
  const { media_id } = useParams();
  const {
    state: { season_number },
  } = useLocation();
  const { data: title, isSuccess: isTitleSuccess } = useFetchTitleQuery({
    media_id: media_id!,
    media_type: MediaTypesEnum.TV,
  });
  const {
    data: season,
    isSuccess: isSeasonSuccess,
    isFetching,
    isLoading,
  } = useFetchSeasonQuery({
    media_id: media_id!,
    season_number: season_number!,
  });

  if (!isTitleSuccess || (!isSeasonSuccess && (isFetching || isLoading))) {
    return <Loader />;
  }

  const newSeason = cloneDeep({
    ...season,
    info_type: SeasonInfoEnum.SEASON,
  }) as SeasonDetails;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
      {title.media_type === MediaTypesEnum.TV && (
        <CollectionComponent seasons={title.seasons} titleId={title.id} />
      )}
      <Typography.Title level={3}>Season Info</Typography.Title>
      <Seasoninfo data={newSeason} />
      <Episodes episodes={newSeason.episodes} />
    </div>
  );
};

export default SeasonPage;
