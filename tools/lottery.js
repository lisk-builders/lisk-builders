const axios = require('axios');
const R = require('ramda');
const delegates = require('../data/delegates.json');

const ROUNDS = 5;

const getRandomArbitrary = R.curry((min, max) =>
    Math.floor(Math.random() * (max - min) + min)
);

// Alias
const asyncProgram = R.pipeP;

// Request builders
const getDelegateRequest = name =>
    axios.get(`https://node02.lisk.io/api/delegates/get?username=${name}`);

const getDelegateVotersRequest = publicKey =>
    axios.get(
        `https://node02.lisk.io/api/delegates/voters?publicKey=${publicKey}`
    );

// Pick data from response
const getPublicKey = R.path(['data', 'delegate', 'publicKey']);
const getAccounts = R.path(['data', 'accounts']);

// "Promise all"
const getDelegatesByName = R.converge(axios.all, [R.map(getDelegateRequest)]);
const getDelegateVoters = R.converge(axios.all, [R.map(getDelegateVotersRequest)]);

// Get some lottery members data
const getLotteryMember = R.filter(R.prop('lotteryMember'));
const getDelegateName = R.map(R.prop('delegateName'));
const getDelegateAddress = R.map(R.prop('delegateAddress'));

// Pick delegate data
const lotteryDelegates = getLotteryMember(delegates);
const lotteryDelegatesName = getDelegateName(lotteryDelegates);
const lotteryDelegatesAddress = getDelegateAddress(lotteryDelegates);

// blacklist filter
const blackList = R.flip(R.contains)(lotteryDelegatesAddress);
const removeBlackListed = R.pipe(R.prop('address'), blackList);

// Combines two lists into a set (i.e. no duplicates)
// composed of those elements common to both lists.
const filterValidAccounts = R.reduce(
    (acc, el) => (acc.length ? R.intersection(acc, el) : el),
    []
);

const normalizeLsk = R.pipe(
    R.prop('balance'),
    R.flip(R.divide)(100000000),
    Math.floor
);

const prepareBalance = R.converge(R.assoc('balance'), [
    normalizeLsk,
    R.identity
]);

const notZeroBalance = account => account.balance > 0;

// Request data from explorer and prepare for lotto
const getAndValidateData = asyncProgram(
    getDelegatesByName,
    R.map(getPublicKey),
    getDelegateVoters,
    R.map(getAccounts),
    filterValidAccounts,
    R.reject(removeBlackListed),
    R.map(prepareBalance),
    R.filter(notZeroBalance)
);

// Lotto functions
const getTotalTickets = R.pipe(R.map(R.prop('balance')), R.sum);

const getFinalTotalTickets = R.pipe(R.map(R.prop('tickets')), R.sum);

const calculateTickets = capTickets =>
    R.converge(R.assoc('tickets'), [
        R.pipe(R.prop('balance'), R.min(capTickets)),
        R.identity
    ]);

// return list of n length filled with address
const fillWithAddress = account => R.repeat(account.address, account.tickets);
// get list filled with lottery member adress
const generateLottoRange = R.reduce(
    (acc, el) => R.concat(fillWithAddress(el), acc),
    []
);

// Recursivly play round and pick winner addresses
const playRound = R.curry((round, candidates) => {
    let winner = candidates[getRandomArbitrary(0, candidates.length)];
    let newRoundCandidates = R.reject(R.equals(winner), candidates);
    return round === 0
        ? []
        : [].concat(winner, playRound(round - 1, newRoundCandidates));
});

const getByAddress = (record, id) => record.address === id;

const lotto = accounts => {
    const totalTickets = getTotalTickets(accounts);
    const capTickets = Math.floor(totalTickets / accounts.length) * 2;
    const firstEntries = R.map(calculateTickets(capTickets))(accounts);
    const finalTotalTickets = getFinalTotalTickets(firstEntries);

    const drawWiners = R.pipe(
        generateLottoRange,
        playRound(ROUNDS),
        R.innerJoin(getByAddress, firstEntries),
        R.map(R.pick(['address', 'tickets']))
    );

    console.log('Total Tickets: ' + totalTickets);
    console.log('Average Tickets: ' + capTickets);
    console.log('Final Total Tickets: ' + finalTotalTickets);
    console.log('Entries: ' + firstEntries.length);
    console.log(drawWiners(firstEntries));
};

// run
asyncProgram(getAndValidateData, lotto)(lotteryDelegatesName);
