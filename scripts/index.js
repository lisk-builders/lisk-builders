import React from 'react';
import _ from 'lodash';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import App from './App';
import axios from 'axios';
import delegates from '../data/delegates.json';

const getDelegateData = delegate =>
    axios
        .get(
            `https://node01.lisk.io/api/delegates/get?username=${delegate.delegateName}`,
        )
        .then(
            res => {
              const data = res.data.delegate;
              if (data) {
                delegate.rank = data.rank;
                delegate.publicKey = data.publicKey;
              }
              return delegate;
            }
        )
        .catch(res => delegate);

const getGitHubData = delegate =>
    axios
        .get(`https://api.github.com/users/${delegate.githubUsername}`)
        .then(
            res =>
                (delegate.avatar_url = res.data.avatar_url
                    ? res.data.avatar_url
                    : undefined),
        )
        .catch(res => delegate);

const renderDom = res => {
    const sortedData = _.sortBy(delegates, ['rank']).reverse();
  render(
    <BrowserRouter>
      <App data={sortedData} />
    </BrowserRouter>,
    document.getElementById('root'));
};

axios
    .all([...delegates.map(getDelegateData), ...delegates.map(getGitHubData)])
    .then(renderDom);
