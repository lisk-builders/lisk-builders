import React from 'react';
import _ from 'lodash';
import { render } from 'react-dom';
import App from './App';
import axios from 'axios';

const data = [
    {
      "delegateName": "5an1ty",
      "delegateAddress": "14871479939815286293L",
      "proposal": "https://forum.lisk.io/viewtopic.php?f=48&t=1521",
      "githubUsername": "5an1ty",
      "poolPercentage": "60",
      "affiliation": "Freelance"
    },
    {
      "delegateName": "isabella",
      "delegateAddress": "12668885769632475474L",
      "proposal": "https://forum.lisk.io/viewtopic.php?f=6&t=201",
      "githubUsername": "Isabello",
      "poolPercentage": "0",
      "affiliation": "Freelance"
    }
]

Promise.all(data.map(delegate => {
  return axios.get(`https://wallet.lisknode.io/api/delegates/get?username=${delegate.delegateName}`)
    .then(res => {
      delegate.rank = res.data.delegate ? parseInt(res.data.delegate.rank) : undefined;
    });
})).then(values => {
  const sortedData = _.sortBy(data, ["rank"]);
  render(
    <App data={sortedData}/>,
    document.getElementById('root')
  );
});