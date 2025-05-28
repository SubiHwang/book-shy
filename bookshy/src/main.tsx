import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { Provider } from 'react-redux';
import { store } from './store'; // 정확한 경로 확인 (예: @/store가 아니라면 상대경로로)
import { WebSocketProvider } from './contexts/WebSocketProvider';

createRoot(document.getElementById('root')!).render(
  <WebSocketProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </WebSocketProvider>,
);
