import { FC } from 'react';
import { Card } from 'antd';
import { CreditType, CreditTypesEnum } from '../interfaces/Credits';
import { appConfig } from '../appConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { MediaTypesEnum } from '../interfaces';
import ImageComponent from './ImageComponent';

// TODO: probably create a new component for media_type person
const Credit: FC<{
  credit: CreditType;
  media_type:
    | MediaTypesEnum.MOVIE
    | MediaTypesEnum.TV
    | MediaTypesEnum.EPISODE
    | MediaTypesEnum.PERSON;
  media_type_nav:
    | MediaTypesEnum.MOVIE
    | MediaTypesEnum.TV
    | MediaTypesEnum.EPISODE
    | MediaTypesEnum.PERSON;
}> = ({ credit, media_type, media_type_nav }) => {
  const navigate = useNavigate();
  const params = useParams();

  const getAdditionalInfo = () => {
    if (credit.credit_type === CreditTypesEnum.CAST) {
      if (
        credit.media_type === MediaTypesEnum.MOVIE ||
        credit.media_type === MediaTypesEnum.PERSON
      ) {
        return credit.character;
      } else if (credit.media_type === MediaTypesEnum.TV) {
        return credit.roles[0].character;
      }
    } else if (credit.credit_type === CreditTypesEnum.CREW) {
      if (
        credit.media_type === MediaTypesEnum.MOVIE ||
        credit.media_type === MediaTypesEnum.PERSON
      ) {
        return credit.job;
      } else if (credit.media_type === MediaTypesEnum.TV) {
        return credit.jobs[0].job;
      }
    }
    return 'N/A';
  };

  console.log({ params });

  const handleNavigation = (context: boolean) => {
    const type = context
      ? 'credit'
      : media_type === MediaTypesEnum.PERSON
      ? `title/${media_type_nav}`
      : 'person';

    // let type
    let id;

    console.log({ context, type, media_type, credit, media_type_nav });
    switch (media_type_nav) {
      case MediaTypesEnum.MOVIE:
        switch (credit.credit_type) {
          case CreditTypesEnum.CAST:
            switch (type) {
              case 'credit':
                id =
                  credit.media_type === MediaTypesEnum.TV
                    ? credit.id
                    : credit.credit_id;
                break;
              case 'person':
              case `title/${media_type_nav}`:
                id = credit.id;
                console.log('reaching here');
                break;
            }
            break;
          case CreditTypesEnum.CREW:
            switch (type) {
              case 'credit':
                id =
                  credit.media_type === MediaTypesEnum.TV
                    ? credit.id
                    : credit.credit_id;
                break;
              case `title/${media_type_nav}`:
              case 'person':
                id = credit.id;
            }
            break;
        }
        break;
      case MediaTypesEnum.TV:
        switch (credit.credit_type) {
          case CreditTypesEnum.CAST:
            switch (type) {
              case 'credit':
                id =
                  credit.media_type === MediaTypesEnum.TV
                    ? credit.roles[0].credit_id
                    : credit.character;
                break;
              case 'person':
              case `title/${media_type_nav}`:
                id = credit.id;
                break;
            }
            break;
          case CreditTypesEnum.CREW:
            switch (type) {
              case 'credit':
                id =
                  credit.media_type === MediaTypesEnum.TV
                    ? credit.jobs[0].credit_id
                    : credit.known_for_department;
                break;
              case 'person':
              case `title/${media_type_nav}`:
                id = credit.id;
            }
            break;
        }
    }
    console.log({ type, id });
    navigate(`/${type}/${id}`);
  };

  return (
    <Card
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleNavigation(true);
      }}
      onClick={() => {
        handleNavigation(false);
      }}
      style={{
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,.1)',
      }}
      bodyStyle={{
        padding: '0',
        borderRadius: '8px 8px 0 0',
        overflow: 'hidden',
        width: +appConfig.profileImageSize.slice(1),
      }}
    >
      <ImageComponent
        size={appConfig.profileImageSize}
        path={
          params.person_id
            ? // @ts-ignore
              credit.poster_path
            : credit.media_type === MediaTypesEnum.PERSON
            ? credit.poster_path
            : credit.profile_path
        }
        style={{ height: 'unset', width: 'unset' }}
        alt="profile"
      />
      <div style={{ padding: '0 1em' }}>
        <h3>
          {credit.media_type === MediaTypesEnum.PERSON
            ? credit.title
            : credit.name}
        </h3>
        <div>{getAdditionalInfo()}</div>
        {credit.media_type === MediaTypesEnum.TV ? (
          <div>{credit.total_episode_count} Episodes</div>
        ) : null}
      </div>
    </Card>
  );
};

export default Credit;
