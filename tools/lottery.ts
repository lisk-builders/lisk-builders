const axios = require("axios");
const delegates = require("../data/delegates.json");

const lotteryMembers = delegates.filter(dg => dg.required);
const optionalMembers = delegates.filter(dg => !dg.required);
const blacklist = lotteryMembers.map(dg => dg.delegateAddress);

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
  const capTickets = Math.floor((totalTickets / cleanedEntries.length) * 2);
  console.log("Total Tickets: " + totalTickets);
  console.log("Average Tickets: " + capTickets);
  const firstEntries = cleanedEntries.map(acc => {
    acc.capTickets = Math.min(acc.tickets, capTickets);
    return acc;
  });
  const finalTotalTickets = firstEntries.reduce((mem, val) => mem + val.capTickets, 0);
  console.log("Final Total Tickets: " + finalTotalTickets);
  console.log("Entries: " + firstEntries.length);
  let firstLotto = [];
  firstEntries.forEach((entry, index) => {
    for (let i = 0; i < entry.capTickets; i++) {
      firstLotto.push(index);
    }
  });
  console.log("Winners:");
  for (let i = 0; i < 20; i++) {
    firstLotto = drawWinner(firstLotto, cleanedEntries);
  }
};

const drawWinner = (tickets, cleanedEntries) => {
  const winnerId = Math.floor(getRandomArbitrary(0, tickets.length));
  const winner = cleanedEntries[tickets[winnerId]];
  const winnerData = { address: winner.address, tickets: winner.tickets, required: winner.required, optional: winner.optional, amount: 250 };
  console.log(JSON.stringify(winnerData));
  return tickets.filter(e => cleanedEntries[e].address !== winner.address);
}

axios.all(delegates.map(getDelegateData)).then(res => {
  res.forEach(dg => {
    dg.voters.forEach(vt => {
      if (blacklist.indexOf(vt.address) === -1) {
        if (dg.required) {
          if (!candidates[vt.address]) {
            candidates[vt.address] = { required: 1, optional: 0 };
          } else {
            candidates[vt.address].required += 1;
          }
        } else {
          if (!candidates[vt.address]) {
            candidates[vt.address] = { required: 0, optional: 1 };
          } else {
            candidates[vt.address].optional += 1;
          }
        }
      }
    });
  });
  const validCandidates = Object.keys(candidates).filter(key => candidates[key].required === lotteryMembers.length);
  Promise.all(
    validCandidates.map(vc => {
      return axios.get(`https://node02.lisk.io/api/accounts/getBalance?address=${vc}`).then(res2 => {
        const tickets = Math.floor(((res2.data.balance ? res2.data.balance : 0) / 100000000) * (1 + ((candidates[vc].optional * 5) / 100)));
        return { address: vc, required: candidates[vc].required, optional: candidates[vc].optional, tickets };
      });
    })
  )
    .then(lotto)
    .catch(err => console.log(err));
});
