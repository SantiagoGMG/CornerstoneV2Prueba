import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Zoom from './ZoomAndContraste';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <h1>Conerstone v2</h1>
    <p>Click izquierdo + con la ruedita del mouse modificas el contraste </p>
    <p>Click derecho + con la ruedita del mouse haces zoom </p>
    <Zoom />
  </React.StrictMode>,
);