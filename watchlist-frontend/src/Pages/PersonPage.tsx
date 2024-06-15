import { appConfig } from '../appConfig';
import { useFetchPersonDetailsQuery } from '../redux/apiSlices/titleSlice';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import PersonInfo from '../components/PersonInfo';
import ImageComponent from '../components/ImageComponent';
import CastInfoNew from '../components/CastInfoNew';
import { MediaTypesEnum } from '../interfaces';

const PersonPage = () => {
  const { person_id } = useParams();

  const { data: person, isSuccess } = useFetchPersonDetailsQuery(person_id!);

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
        <ImageComponent
          size={appConfig.detailsTitleImageSize}
          path={person.profile_path}
          style={{
            boxShadow: '0 0 10px 2px rgba(0,0,0,0.1)',
            borderRadius: '5px',
          }}
        />
        <PersonInfo person={person} />
      </header>
      <main style={{ marginTop: '2em' }}>
        <CastInfoNew
          credits={person.combined_credits}
          media_type={MediaTypesEnum.PERSON}
        />
      </main>
    </div>
  );
};

export default PersonPage;
