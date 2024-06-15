import { useAppSelector } from '../redux/store';

const ImdbInfo = ({
  imdb_id,
  inline,
  full,
}: {
  imdb_id: string;
  inline: boolean;
  full: boolean;
}) => {
  const imdb_rating = useAppSelector(
    (state) => state.state.imdb_ratings.imdb_ids[imdb_id]
  );

  return (
    <div
      style={
        inline
          ? { display: 'inline-flex', gap: '1em', alignItems: 'center' }
          : {}
      }
    >
      <div
        style={{
          display: 'flex',
          gap: '.5em',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src="https://ia.media-imdb.com/images/G/01/imdb/plugins/rating/images/imdb_37x18.png"
          alt="IMDB"
        />
        <span style={{ fontWeight: 'bold' }}>
          {imdb_rating && imdb_rating?.rating}
        </span>
        {full && <span>{imdb_rating && imdb_rating?.votes}</span>}
      </div>
    </div>
  );
};

export default ImdbInfo;
