import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {ConfigProvider} from 'antd';
import ruRU from 'antd/locale/ru_RU';
import {defaultTheme} from './theme/default.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={ruRU} theme={defaultTheme}>
      <App />
    </ConfigProvider>
  </StrictMode>,
);
