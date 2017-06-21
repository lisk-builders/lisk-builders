import React from 'react';
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
      "affiliation": "Freelance",
      "githubActivity" : "Loading..."
    },
    {
      "delegateName": "isabella",
      "delegateAddress": "12668885769632475474L",
      "proposal": "https://forum.lisk.io/viewtopic.php?f=6&t=201",
      "githubUsername": "Isabello",
      "poolPercentage": "0",
      "affiliation": "Freelance",
      "githubActivity" : "Loading..."
    }
]

Promise.all(data.map(delegate => {
  return axios.get(`https://api.github.com/users/${delegate.githubUsername}/events`)
    .then(res => {
      const liskCommits = res.data.filter(event => event.repo.name.toLowerCase().includes('lisk'));
      delegate.githubActivity = liskCommits.length;
    });
})).then(values => { 
  render(
    <App data={data}/>,
    document.getElementById('root')
  );
});

render(
  <App data={data}/>,
  document.getElementById('root')
);