import {Content as ContentAnt} from 'antd/es/layout/layout';
import styles from './styles.module.scss';
import {Empty, Flex, Spin, Typography} from 'antd';
import {$addressSelect, $weather, $weatherState} from '../../models/weatherPage';
import {useUnit} from 'effector-react';
import {LoadingOutlined} from '@ant-design/icons';
import {Map} from '../Map';
import {AddressHistorySelect} from './AddressHistorySelect';
import {WeatherCard} from './Card';

export const Content = () => {
  const [weather, weatherState, addressSelect] = useUnit([$weather, $weatherState, $addressSelect]);

  return (
    <ContentAnt className={styles.content}>
      <AddressHistorySelect />
      <Flex gap='large'>
        <Flex vertical>
          <Typography.Title level={3} style={{textAlign: 'center'}}>
            Данные о погоде
          </Typography.Title>
          {addressSelect && !weatherState.weatherLoading && !weather && 'Ничего не найдено'}
          {!addressSelect && !weather && (
            <Flex vertical>
              <Empty style={{width: 400}} />
            </Flex>
          )}
          {weather ? (
            <WeatherCard weather={weather} />
          ) : weatherState.weatherLoading ? (
            <Spin indicator={<LoadingOutlined style={{fontSize: 48}} spin />} />
          ) : null}
        </Flex>
        <Map />
      </Flex>
    </ContentAnt>
  );
};
