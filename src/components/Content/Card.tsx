import {Card, Flex, Typography} from 'antd';
import type {WeatherUi} from '../../types';
import Meta from 'antd/es/card/Meta';
import styles from './styles.module.scss';

export const WeatherCard = ({weather}: {weather: WeatherUi}) => {
  const {iconUrl, temp, feelsLike, tempMin, tempMax, windSpeed, city, description} = weather;
  const stub = 'Нет данных';

  const {Text} = Typography;
  return (
    <Card
      style={{width: 400}}
      cover={<img alt='wether icon' src={iconUrl} className={styles.imgCard} />}
    >
      <Flex vertical className={styles.description}>
        <Text italic>Температура: {temp ?? stub} ℃</Text>
        <Text italic>Ощущается как: {feelsLike ?? stub} ℃</Text>
        <Text italic>Минимальная: {tempMin ?? stub} ℃</Text>
        <Text italic>Максимальная: {tempMax ?? stub} ℃</Text>
        <Text italic>Влажность: {tempMax ?? stub} %</Text>
        <Text italic>Скорость ветра: {windSpeed ?? stub} м/c</Text>
      </Flex>
      <Meta title={city ?? stub} description={description ?? stub} />
    </Card>
  );
};
