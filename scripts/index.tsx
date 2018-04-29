import * as React from 'react';
import { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { hot } from 'react-hot-loader'

export default hot(module)(App)

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'));