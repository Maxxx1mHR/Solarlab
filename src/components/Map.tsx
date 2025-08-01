import {Map as YandexMap} from '@pbe/react-yandex-maps';
import {mapSelected} from '../models/weatherPage';

type CoordinatesType = [number, number];

interface IMapClickEvent {
  get: (key: string) => CoordinatesType;
}

export const Map = () => {
  return (
    <div style={{width: '100%', height: 'calc(100vh - 260px)'}}>
      <YandexMap
        width='100%'
        height='calc(100vh - 260px)'
        defaultState={{center: [55.75, 37.57], zoom: 9}}
        onClick={(e: IMapClickEvent) => {
          const coords = e.get('coords');
          mapSelected(coords);
        }}
      />
    </div>
  );
};
