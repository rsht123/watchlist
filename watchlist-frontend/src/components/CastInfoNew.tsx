import { MediaTypesEnum } from '../interfaces';
import { Typography } from 'antd';
import { Cast, CreditTypesEnum, Credits, Crew } from '../interfaces/Credits';
import Credit from './Credit';
import { useRef } from 'react';
import useOnScreen from '../hooks/useOnScreen';

const CastInfoNew = ({
  credits,
  media_type,
}: {
  credits: Credits;
  media_type:
    | MediaTypesEnum.MOVIE
    | MediaTypesEnum.TV
    | MediaTypesEnum.EPISODE
    | MediaTypesEnum.PERSON;
}) => {
  const castRef = useRef<HTMLDivElement>(null);
  const crewRef = useRef<HTMLDivElement>(null);

  const isCastVisible = useOnScreen(castRef);
  const isCrewVisible = useOnScreen(crewRef);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
      <div ref={castRef}>
        {isCastVisible && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'start',
                gap: '1em',
              }}
            >
              <Typography.Title style={{ margin: '0em' }} level={4}>
                Cast
              </Typography.Title>
            </div>
            <div
              style={{
                padding: '1em 0',
                display: 'flex',
                gap: '1em',
                width: '100%',
                overflow: 'auto',
              }}
            >
              {credits.cast?.map((cast, index) => {
                const curr_media_type =
                  media_type === MediaTypesEnum.PERSON
                    ? cast.media_type
                    : media_type;
                console.log({ cast_media_type: curr_media_type });
                const credit = {
                  ...cast,
                  credit_type: CreditTypesEnum.CAST,
                  media_type,
                } as Cast;
                return (
                  <Credit
                    key={`cast-${cast.id}-${index}`}
                    credit={credit}
                    media_type={media_type}
                    media_type_nav={curr_media_type}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
      <div ref={crewRef}>
        {isCrewVisible && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'start',
                gap: '1em',
              }}
            >
              <Typography.Title style={{ margin: '0em' }} level={4}>
                Crew
              </Typography.Title>
            </div>
            <div
              style={{
                padding: '1em 0',
                display: 'flex',
                gap: '1em',
                width: '100%',
                overflow: 'auto',
              }}
            >
              {credits.crew?.map((crew, index) => {
                const curr_media_type =
                  media_type === MediaTypesEnum.PERSON
                    ? crew.media_type
                    : media_type;
                // const curr_media_type = media_type;
                const credit = {
                  ...crew,
                  credit_type: CreditTypesEnum.CREW,
                  media_type: curr_media_type,
                } as Crew;
                return (
                  <Credit
                    key={`crew-${crew.id}-${index}`}
                    credit={credit}
                    media_type={media_type}
                    media_type_nav={curr_media_type}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CastInfoNew;
