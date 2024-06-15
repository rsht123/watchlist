import { Card, Col, Row, Typography } from 'antd';
import { appConfig } from '../appConfig';
import { SeasonInfoEnum, SeasonInfoTypes } from '../interfaces/Tv';
import ImdbInfo from './ImdbInfo';
import { useNavigate } from 'react-router-dom';
import ImageComponent from './ImageComponent';

const SeasonInfo = ({ data }: { data: SeasonInfoTypes }) => {
  const navigate = useNavigate();

  const getImageSize = () => {
    return data.info_type === SeasonInfoEnum.EPISODE
      ? appConfig.listEpisodeImageSize
      : appConfig.profileImageSize;
  };

  const getImagePath = () => {
    return data.info_type === SeasonInfoEnum.EPISODE
      ? data.still_path
      : data.poster_path;
  };

  const handleNavigate = () => {
    if (data.info_type === SeasonInfoEnum.EPISODE) {
      navigate(
        `/title/tv/${data.show_id}/season/${data.season_number}/episode/${data.episode_number}`
      );
    }
  };

  return (
    <Row style={{ height: 'auto' }}>
      <Col span={24}>
        <Card style={{ overflow: 'hidden' }} bodyStyle={{ padding: '0' }}>
          <Row gutter={20} justify={'start'}>
            <Col span={data.info_type === SeasonInfoEnum.EPISODE ? 5 : 3}>
              <ImageComponent
                size={getImageSize()}
                path={getImagePath()}
                style={{ objectFit: 'cover' }}
              />
            </Col>
            <Col
              style={
                data.info_type === SeasonInfoEnum.EPISODE
                  ? { cursor: 'pointer' }
                  : {}
              }
              span={data.info_type === SeasonInfoEnum.EPISODE ? 19 : 21}
              onClick={handleNavigate}
            >
              <Typography.Title level={2} style={{ marginTop: '.5em' }}>
                {data.name}{' '}
                {data.info_type === SeasonInfoEnum.SEASON
                  ? `(${data.episodes.length})`
                  : data.info_type === SeasonInfoEnum.EPISODE
                  ? `(${data.episode_number})`
                  : null}
              </Typography.Title>
              <Typography.Paragraph
                // ellipsis
                className="description small"
              >
                {data.overview}
              </Typography.Paragraph>
              {data.info_type === SeasonInfoEnum.EPISODE ? (
                <ImdbInfo imdb_id={data.imdb_id} inline={true} full={true} />
              ) : null}
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default SeasonInfo;
