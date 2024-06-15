import { useNavigate, useParams } from 'react-router-dom';
import { useFetchTitleQuery } from '../redux/apiSlices/titleSlice';
import Loader from '../components/Loader';
import { appConfig } from '../appConfig';
import { MediaTypesEnum } from '../interfaces';
import TitleInfo from '../components/TitleInfo';
import CollectionComponent from '../components/Collection';
import AdditionalTitleInfo from '../components/AdditionalTitleInfo';
import CastInfoNew from '../components/CastInfoNew';
import ImageComponent from '../components/ImageComponent';

const TitlePage = ({
  media_id,
  media_type,
}: {
  media_id?: string;
  media_type?: MediaTypesEnum;
}) => {
  const params = useParams();
  if (!media_id && !media_type) {
    media_id = params.media_id;
    media_type = params.media_type as MediaTypesEnum;
  }
  const navigate = useNavigate();

  const {
    data: title,
    isLoading,
    isFetching,
    isSuccess,
  } = useFetchTitleQuery({ media_id: media_id!, media_type: media_type! });

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (!isSuccess) {
    return <Loader />;
  }

  if (
    title.media_type === MediaTypesEnum.MOVIE &&
    title.belongs_to_collection &&
    !params.collection_id
  ) {
    navigate(`/title/collection/${title.belongs_to_collection.id}`, {
      state: { movieId: title.id },
      replace: true,
    });
  }

  const newCredits =
    title.media_type === MediaTypesEnum.MOVIE
      ? title.credits
      : title.aggregate_credits;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '1em',
      }}
    >
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
        <ImageComponent
          src={`${appConfig.imageBaseUrl}${appConfig.detailsTitleImageSize}${title.poster_path}`}
          size={appConfig.detailsTitleImageSize}
          path={title.poster_path}
          style={{
            boxShadow: '0 0 10px 2px rgba(0,0,0,0.1)',
            borderRadius: '5px',
          }}
        />
        <TitleInfo title={title} />
      </header>
      <main style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        {title.media_type === MediaTypesEnum.TV && (
          <CollectionComponent seasons={title.seasons} titleId={title.id} />
        )}
        <CastInfoNew credits={newCredits} media_type={title.media_type} />
        <AdditionalTitleInfo
          titles={title.recommendations!.results}
          media_type={media_type!}
          info_type={'recommendations'}
        />
      </main>
    </div>
  );
};

export default TitlePage;
