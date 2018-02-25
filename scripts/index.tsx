import * as React from 'react';
import { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';

if (module.hot) {
  module.hot.accept();
}

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'));