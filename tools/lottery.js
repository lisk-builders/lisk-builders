const axios = require('axios');
const delegates = require('../data/delegates.json');

const freelancers = delegates.filter(dg => dg.affiliation === 'Freelance');

const candidates = {};

const getRandomArbitrary = function(min, max) {
    return Math.random() * (max - min) + min;
};

const getDelegateData = delegate =>
    axios.get(`https://node02.lisk.io/api/delegates/get?username=${delegate.delegateName}`)
        .then(res => {
                return axios.get(`https://node02.lisk.io/api/delegates/voters?publicKey=${res.data.delegate.publicKey}`)
                .then(res2 => {
                  delegate.voters = res2.data.accounts ? res2.data.accounts : undefined
                  return delegate;
                });
        })
        .catch(res => delegate);

axios
    .all(freelancers.map(getDelegateData))
    .then((res) => {
      res.forEach(dg => {
        dg.voters.forEach(vt => {
          if (!candidates[vt.address]) {
            candidates[vt.address] = 1;
          } else {
            candidates[vt.address] += 1;
          }
        });
      });
      const validCandidates = Object.keys(candidates).filter(key => candidates[key] >= freelancers.length - 1);
      Promise.all(validCandidates.map(vc => {
          return axios.get(`https://node02.lisk.io/api/accounts/getBalance?address=${vc}`).then(res2 => {
            return { account: vc, tickets: Math.floor((res2.data.balance ? res2.data.balance : 0) / 100000000) };
          });
      })).then(res3 => {
        const totalTickets = res3.reduce((mem, val) => mem + val.tickets, 0);
        const avgTickets = Math.floor(totalTickets / res3.length);
        console.log('Total Tickets: ' + totalTickets);
        console.log('Average Tickets: ' + avgTickets);
        const entries = res3.map(acc => {
          acc.tickets = Math.min(acc.tickets, avgTickets);
          return acc;
        });
        const finalTotalTickets = entries.reduce((mem, val) => mem + val.tickets, 0);
        console.log('Final Total Tickets: ' + finalTotalTickets);
        console.log('Entries:');
        console.log(entries);
        const lotto = [];
        entries.forEach((entry, index) => {
          for (let i = 0; i < entry.tickets; i++) {
            lotto.push(index);
          }
        });
        const winnerId = Math.floor(getRandomArbitrary(0, lotto.length));
        console.log('Winner: ' + JSON.stringify(entries[lotto[winnerId]]));
      }).catch(err => console.log(err));
      //console.log(validCandidates);
    });
