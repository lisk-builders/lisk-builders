const axios = require("axios");
const delegates = require("../data/delegates.json");

const lotteryMembers = delegates.filter(dg => dg.lotteryMember && dg.delegateName !== '5an1ty' && dg.delegateName !== 'alepop');
const blacklist = delegates.filter(dg => dg.lotteryMember).map(dg => dg.delegateAddress);

const candidates = {};

const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};

const getDelegateData = delegate =>
  axios
    .get(`https://node02.lisk.io/api/delegates/get?username=${delegate.delegateName}`)
    .then(res => {
      return axios.get(`https://node02.lisk.io/api/delegates/voters?publicKey=${res.data.delegate.publicKey}`).then(res2 => {
        delegate.voters = res2.data.accounts ? res2.data.accounts : undefined;
        return delegate;
      });
    })
    .catch(res => delegate);

const lotto = entries => {
  const cleanedEntries = entries.filter(e => e.tickets > 0);
  const totalTickets = cleanedEntries.reduce((mem, val) => mem + val.tickets, 0);
  const capTickets = Math.floor(totalTickets / cleanedEntries.length) * 2;
  console.log("Total Tickets: " + totalTickets);
  console.log("Average Tickets: " + capTickets);
  const firstEntries = cleanedEntries.map(acc => {
    acc.tickets = Math.min(acc.tickets, capTickets);
    return acc;
  });
  const finalTotalTickets = firstEntries.reduce((mem, val) => mem + val.tickets, 0);
  console.log("Final Total Tickets: " + finalTotalTickets);
  console.log("Entries: " + firstEntries.length);
  const firstLotto = [];
  firstEntries.forEach((entry, index) => {
    for (let i = 0; i < entry.tickets; i++) {
      firstLotto.push(index);
    }
  });
  const firstWinnerId = Math.floor(getRandomArbitrary(0, firstLotto.length));
  const firstWinner = cleanedEntries[firstLotto[firstWinnerId]];
  console.log("First Prize Winner: " + JSON.stringify(firstWinner));
  const secondLotto = firstLotto.filter(e => cleanedEntries[e].address !== firstWinner.address);
  const secondWinnerId = Math.floor(getRandomArbitrary(0, secondLotto.length));
  const secondWinner = cleanedEntries[secondLotto[secondWinnerId]];
  console.log("Second Prize Winner: " + JSON.stringify(secondWinner));
  const thirdLotto = secondLotto.filter(e => [firstWinner.address, secondWinner.address].indexOf(cleanedEntries[e].address) === -1);
  const thirdWinnerId = Math.floor(getRandomArbitrary(0, thirdLotto.length));
  const thirdWinner = cleanedEntries[thirdLotto[thirdWinnerId]];
  console.log("Third Prize Winner: " + JSON.stringify(thirdWinner));
};

axios.all(lotteryMembers.map(getDelegateData)).then(res => {
  res.forEach(dg => {
    dg.voters.forEach(vt => {
      if (blacklist.indexOf(vt.address) === -1) {
        if (!candidates[vt.address]) {
          candidates[vt.address] = 1;
        } else {
          candidates[vt.address] += 1;
        }
      }
    });
  });
  const validCandidates = Object.keys(candidates).filter(key => candidates[key] === lotteryMembers.length);
  Promise.all(
    validCandidates.map(vc => {
      return axios.get(`https://node02.lisk.io/api/accounts/getBalance?address=${vc}`).then(res2 => {
        return { address: vc, tickets: Math.floor((res2.data.balance ? res2.data.balance : 0) / 100000000) };
      });
    })
  )
    .then(lotto)
    .catch(err => console.log(err));
});
