import {Layout} from 'antd';
import './styles/index.scss';

import {useGate} from 'effector-react';
import {WeatherGate} from './models/weatherPage';
import {YMaps} from '@pbe/react-yandex-maps';
import {ToastContainer} from 'react-toastify';
import {Header} from './components/Header';
import {Content} from './components/Content';
import {Footer} from './components/Footer';

function App() {
  useGate(WeatherGate);

  const API_KEY = import.meta.env.VITE_YANDEX_API_KEY;

  return (
    <>
      <ToastContainer />
      <YMaps query={{apikey: API_KEY}}>
        <Layout style={{height: '100vh'}}>
          <Header />
          <Content />
          <Footer />
        </Layout>
      </YMaps>
    </>
  );
}

export default App;
