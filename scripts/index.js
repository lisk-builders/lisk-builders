import React from 'react';
import _ from 'lodash';
import { render } from 'react-dom';
import App from './App';
import axios from 'axios';
import delegates from '../data/delegates.json';

const getDelegateData = delegate =>
  axios.get(`https://wallet.lisknode.io/api/delegates/get?username=${delegate.delegateName}`)
    .then(res => delegate.rank = res.data.delegate ? parseInt(res.data.delegate.rank) : undefined);

const renderDom = data => {
  const sortedData = _.sortBy(delegates, ["rank"]);
    render(
      <App data={sortedData}/>,
      document.getElementById('root')
  );
}

axios.all(delegates.map(getDelegateData)).then(renderDom)

