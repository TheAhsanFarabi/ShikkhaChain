import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// CRA no longer requires reportWebVitals unless you're tracking analytics
// Comment it out unless you are using it
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want performance monitoring, uncomment below and create reportWebVitals.js
// reportWebVitals(console.log);
