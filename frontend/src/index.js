import React from 'react';
import ReactDOM from 'react-dom/client'; // Importation depuis 'react-dom/client'
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Création du root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
