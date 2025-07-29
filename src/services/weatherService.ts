import axios from 'axios';
import type {WeatherResponse} from '../types';

const API_KEY = import.meta.env.VITE_OPEN_WEATHER_KEY;
export async function getWeather(params: {lat: string; lon: string}): Promise<WeatherResponse> {
  console.log('params', params);
  return (
    await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        lat: params.lat,
        lon: params.lon,
        appid: API_KEY,
        lang: 'ru',
      },
    })
  ).data;
}
