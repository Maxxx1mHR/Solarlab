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

  return (
    <>
      <ToastContainer />
      <YMaps query={{apikey: '757e65ef-d71b-4780-a37b-994888e4d37a'}}>
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
