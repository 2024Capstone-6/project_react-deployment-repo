import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

// React 애플리케이션의 진입점
// document.getElementById('root'): 루트 엘리먼트 가져오기
const rootElement = document.getElementById('root');
if (rootElement) {
  // createRoot: 루트 렌더링 관리
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    // React 개발 모드에서만 활성화되는 래퍼 컴포넌트
    // 애플리케이션의 잠재적인 문제를 감지하고 경고를 출력
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
