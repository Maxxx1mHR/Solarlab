import {combine, createDomain, sample} from 'effector';
import {createGate} from 'effector-react';
import {getAddressSuggestion} from '../../services/addressService';
import {getWeather} from '../../services/weatherService';
import type {WeatherUi} from '../../types';
import {toast} from 'react-toastify';
import {message} from 'antd';

export interface Addresses {
  label: string;
  value: {
    lat: string;
    lon: string;
  };
}

export const weatherDomain = createDomain();

export const WeatherGate = createGate();

// Stores
export const $addressSuggestion = weatherDomain.createStore<Addresses[] | null>(null);
export const $weather = weatherDomain.createStore<WeatherUi | null>(null);
export const $addressSelect = weatherDomain.createStore<string>('');
export const $addressHistory = weatherDomain.createStore<Addresses[]>([]);

// Events
export const addressSearched = weatherDomain.createEvent<string>();
export const addressSelected = weatherDomain.createEvent<Addresses>();
export const addressHistoryCleared = weatherDomain.createEvent();
export const addressFromHistorySelected = weatherDomain.createEvent<Addresses>();
export const geolocationSearched = weatherDomain.createEvent();

export const mapSelected = weatherDomain.createEvent<[number, number]>();

// Effects
export const addressSuggestionFx = weatherDomain.createEffect(getAddressSuggestion);
export const weatherFx = weatherDomain.createEffect(getWeather);
export const locateErrorFx = weatherDomain.createEffect(
  (error: {code: number; message: string}) => {
    if (error.code === 1) {
      return toast.error(
        'Геолокация отключена. Разрешите определение местоположения в настройках браузера',
      );
    } else {
      return toast.error(`Что-то пошло не так, попробуйте еще раз ${message}`);
    }
  },
);

export const locateFx = weatherDomain.createEffect<
  void,
  {lat: number; lon: number},
  GeolocationPositionError
>(
  () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error('Геолокация не поддерживается'));
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          }),
        (error) => reject(error),
      );
    }),
);

export const clearHistoryFx = weatherDomain.createEffect(() => {
  localStorage.removeItem('addressesSuggestion');
});

// Logic

sample({
  clock: geolocationSearched,
  // clock: WeatherGate.open,
  target: locateFx,
});

export const $coords = weatherDomain
  .createStore<{lat: string; lon: string}>({lat: '', lon: ''})
  .on(locateFx.doneData, (_, {lat, lon}) => ({
    lat: lat.toString(),
    lon: lon.toString(),
  }));

// $coords.watch((e) => console.log('123', e));
sample({
  clock: locateFx.failData,
  fn: (err) => {
    console.log('er', err);
    return err;
  },
  target: locateErrorFx,
});

sample({
  source: addressSearched,
  fn: (addressSource) => ({
    query: addressSource,
  }),
  target: addressSuggestionFx,
});

sample({
  clock: addressSuggestionFx.doneData,
  fn: ({suggestions}) => {
    return (suggestions ?? []).map((suggestion) => ({
      label: suggestion.value,
      value: {lat: suggestion.data.geo_lat, lon: suggestion.data.geo_lon},
    }));
  },
  target: $addressSuggestion,
});

sample({
  clock: addressSelected,
  fn: (address) => {
    const raw = localStorage.getItem('addressesSuggestion');

    const list = raw ? JSON.parse(raw) : [];

    list.push(address);
    localStorage.setItem('addressesSuggestion', JSON.stringify(list));

    return {
      lat: address.value.lat,
      lon: address.value.lon,
    };
  },
  target: weatherFx,
});

// sample({
//   clock: addressSelected,
//   target: $addressHistory
// })

$addressHistory
  .on(addressSelected, (state, payload) => [...state, payload])
  .on(
    WeatherGate.open,
    () => JSON.parse(localStorage.getItem('addressesSuggestion') ?? '[]') as Addresses[],
  )
  .on(addressHistoryCleared, () => []);

sample({
  clock: mapSelected,
  fn: (map) => ({
    lat: map[0].toString(),
    lon: map[1].toString(),
  }),
  target: weatherFx,
});
sample({
  clock: addressFromHistorySelected,
  fn: (address) => ({
    lat: address.value.lat,
    lon: address.value.lon,
  }),
  target: weatherFx,
});

sample({
  clock: $coords,
  target: weatherFx,
});

$addressSelect.on(addressSelected, (_, payload) => payload.label);

sample({
  clock: weatherFx.doneData,
  fn: (weather) => ({
    city: weather.name,
    description: weather.weather[0].description,
    iconUrl: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
    temp: (weather.main.temp - 272.15).toFixed(),
    feelsLike: (weather.main.feels_like - 272.15).toFixed(),
    tempMin: (weather.main.temp_min - 272.15).toFixed(),
    tempMax: (weather.main.temp_max - 272.15).toFixed(),
    humidity: weather.main.humidity,
    windSpeed: weather.wind.speed,
  }),
  target: $weather,
});

export const $weatherState = combine({
  weatherLoading: weatherFx.pending,
});

sample({
  clock: addressHistoryCleared,
  target: clearHistoryFx,
});
