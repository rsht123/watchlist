import { Tag, Tooltip } from 'antd';
import { Genre, Keyword } from '../interfaces/Title';

const Genres = ({
  genres,
  keywords,
}: {
  genres: Genre[];
  keywords: Keyword[];
}) => {
  return (
    <div style={{ display: 'flex', gap: '1em' }}>
      <div>
        <strong>Genre: </strong>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'start',
          justifyContent: 'start',
          gap: '.5em',
        }}
      >
        {/* <div>Genres: </div> */}
        {genres.map((genre) => (
          <Tooltip key={genre.id} title={genre.id}>
            <Tag
              color="blue"
              style={{ cursor: 'pointer', margin: '0' }}
              onClick={() => navigator.clipboard.writeText(genre.id.toString())}
            >
              {genre.name}
            </Tag>
          </Tooltip>
        ))}
      </div>
      <div>
        <strong>Keywords: </strong>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'start',
          justifyContent: 'start',
          gap: '.5em',
        }}
      >
        {keywords?.slice(0, 5).map((keyword) => (
          <Tooltip key={keyword.id} title={keyword.id}>
            <Tag
              color="#108ee9"
              style={{ cursor: 'pointer', margin: '0' }}
              onClick={() =>
                navigator.clipboard.writeText(keyword.id.toString())
              }
            >
              {keyword.name}
            </Tag>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default Genres;
