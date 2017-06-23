import React from 'react';
import _ from 'lodash';
import { render } from 'react-dom';
import App from './App';
import axios from 'axios';
import delegates from '../data/delegates.json';

const getDelegateData = delegate =>
  axios.get(`https://wallet.lisknode.io/api/delegates/get?username=${delegate.delegateName}`)
    .then(res => delegate.rank = res.data.delegate ? parseInt(res.data.delegate.rank) : undefined)

const getGitHubData = delegate =>
  axios.get(`https://api.github.com/users/${delegate.githubUsername}`)
  .then(res => delegate.avatar_url = res.data.avatar_url ? res.data.avatar_url : undefined)
  .catch(res => delegate);

const renderDom = res => {
  const sortedData = _.sortBy(delegates, ["rank"]);
    render(
      <App data={sortedData}/>,
      document.getElementById('root')
  );
}

axios.all([...delegates.map(getDelegateData), ...delegates.map(getGitHubData)]).then(renderDom);

