import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWAとしてService Workerを登録
serviceWorkerRegistration.register({
  onSuccess: (registration) => {
    console.log('AromaWise PWA is ready for offline use!', registration);
  },
  onUpdate: (registration) => {
    console.log('New version available! Please reload to update.', registration);
    // ユーザーに更新を促す通知を表示することも可能
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
