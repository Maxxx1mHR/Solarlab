import {Button, Card, Flex, Layout, Select, Spin} from 'antd';
import {Content, Header} from 'antd/es/layout/layout';
import './styles/index.scss';

import {useGate, useUnit} from 'effector-react';
import {
  addressSearched,
  addressSelected,
  $addressSuggestion,
  WeatherGate,
  $weather,
  $weatherState,
  $addressSelect,
  type Addresses,
  mapSelected,
  $addressHistory,
  addressHistoryCleared,
  addressFromHistorySelected,
} from './models/weatherPage';
import {debounce} from './utils/debounce';
import Meta from 'antd/es/card/Meta';
import {LoadingOutlined} from '@ant-design/icons';
import {YMaps, Map} from '@pbe/react-yandex-maps';
import styles from './app.module.scss';

function App() {
  useGate(WeatherGate);

  const handleSearch = debounce((searchValue: string) => {
    addressSearched(searchValue);
  }, 380);

  const [addressesOption, weather, weatherState, addressSelect, addressHistory] = useUnit([
    $addressSuggestion,
    $weather,
    $weatherState,
    $addressSelect,
    $addressHistory,
  ]);

  type CoordinatesType = [number, number];

  interface IMapClickEvent {
    get: (key: string) => CoordinatesType;
  }

  return (
    <YMaps query={{apikey: '757e65ef-d71b-4780-a37b-994888e4d37a'}}>
      <Layout style={{height: '100vh'}}>
        <Header>
          <Select
            style={{width: '100%'}}
            placeholder='Введите название города'
            showSearch
            onSearch={handleSearch}
            onSelect={(_, option) => {
              addressSelected({
                label: option.value?.toString() ?? '',
                value: {
                  lat: option.lat,
                  lon: option.lon,
                },
              });
            }}
          >
            {addressesOption?.map(({label, value}) => (
              <Select.Option key={label} value={label} lat={value.lat} lon={value.lon}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Header>
        <Content className={styles.content}>
          <Flex>
            <Select
              placeholder='История поиска'
              style={{width: 300}}
              onSelect={(_, option) => {
                addressFromHistorySelected({
                  label: option.value?.toString() ?? '',
                  value: {
                    lat: option.lat,
                    lon: option.lon,
                  },
                });
              }}
              popupRender={(menu) => (
                <>
                  {menu}
                  <Button
                    style={{marginTop: 20}}
                    onClick={() => {
                      addressHistoryCleared();
                    }}
                  >
                    Очистить предыдущие значения поиска
                  </Button>
                </>
              )}
            >
              {addressHistory?.map(({label, value}) => (
                <Select.Option key={label} value={label} lat={value.lat} lon={value.lon}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Flex>
          <Flex>
            {addressSelect && !weatherState.weatherLoading && !weather && 'Ничего не найдено'}
            {!addressSelect && !weather && 'Введите город для поиска'}
            {weather ? (
              <Card
                hoverable
                style={{width: 240}}
                cover={<img alt='wether icon' src={weather?.iconUrl} />}
              >
                <div>Температура: {weather?.temp} ℃</div>
                <div>Ощущается как: {weather?.feelsLike} ℃</div>
                <div>Минимальная: {weather?.tempMin} ℃</div>
                <div>Максимальная: {weather?.tempMax} ℃</div>
                <div>Влажность: {weather?.tempMax} %</div>
                <div>Скорость ветра: {weather?.windSpeed} м/c</div>
                <br />
                <Meta title={weather.city} description={weather.description} />
              </Card>
            ) : weatherState.weatherLoading ? (
              <Spin indicator={<LoadingOutlined style={{fontSize: 48}} spin />} />
            ) : null}
            <Map
              width='100%'
              height='calc(100vh - 120px)'
              defaultState={{center: [55.75, 37.57], zoom: 9}}
              onClick={(e: IMapClickEvent) => {
                const coords = e.get('coords');
                (mapSelected(coords), console.log('coords:', coords));
              }}
            />
          </Flex>
        </Content>
      </Layout>
    </YMaps>
  );
}

export default App;
