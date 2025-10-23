// src/main.tsx

import 'bootstrap/dist/css/bootstrap.min.css';     // ✅ Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // ✅ Bootstrap JS (for modals, navbars, etc.)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
