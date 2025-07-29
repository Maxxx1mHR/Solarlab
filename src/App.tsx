import {Button, Card, Layout, Select, Spin} from 'antd';
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
} from './models/weatherPage';
import {debounce} from './utils/debounce';
import Meta from 'antd/es/card/Meta';
import {LoadingOutlined} from '@ant-design/icons';

function App() {
  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff',
  };

  useGate(WeatherGate);

  const handleSearch = debounce((searchValue: string) => {
    addressSearched(searchValue);
  }, 380);

  const [addressesOption, weather, weatherState, addressSelect] = useUnit([
    $addressSuggestion,
    $weather,
    $weatherState,
    $addressSelect,
  ]);

  const test = localStorage.getItem('addressesSuggestion');

  return (
    <>
      <Layout>
        <Header style={headerStyle}>
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
            popupRender={(menu) => (
              <>
                {menu}{' '}
                <Button onClick={() => localStorage.removeItem('addressesSuggestion')}>
                  Очистить предыдущие значения поиска
                </Button>
              </>
            )}
          >
            {(addressesOption ?? (JSON.parse(test ?? '[]') as Addresses[]))?.map(
              ({label, value}) => (
                <Select.Option key={label} value={label} lat={value.lat} lon={value.lon}>
                  {label}
                </Select.Option>
              ),
            )}
          </Select>
        </Header>
        <Content>
          <div>
            <div>
              {addressSelect && !weatherState.weatherLoading && !weather && 'Ничего не найдено'}
            </div>
            <div>{!addressSelect && 'Введите город для поиска'}</div>
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
          </div>
        </Content>
      </Layout>
    </>
  );
}

export default App;
