import {combine, createDomain, sample} from 'effector';
import {createGate} from 'effector-react';
import {getAddressSuggestion} from '../../services/addressService';
import {getWeather} from '../../services/weatherService';
import type {WeatherUi} from '../../types';

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

// Events
export const addressSearched = weatherDomain.createEvent<string>();
export const addressSelected = weatherDomain.createEvent<{
  label: string;
  value: {
    lat: string;
    lon: string;
  };
}>();

// Effects
export const addressSuggestionFx = weatherDomain.createEffect(getAddressSuggestion);
export const weatherFx = weatherDomain.createEffect(getWeather);

// Logic
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
