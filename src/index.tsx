import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './scripts/App';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { defineCustomElements as defineLiskButtons } from '@lisk-builders/lisk-buttons/dist/loader';

ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
document.getElementById('root'));
defineLiskButtons(window);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();