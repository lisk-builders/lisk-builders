import * as classnames from 'classnames';
import BigNumber from 'bignumber.js';

const getRandomArbitrary = (minV, maxV) => {
  const min = Math.ceil(minV);
  const max = Math.floor(maxV);
  return Math.floor(Math.random() * (max - min)) + min;
};

export const rankClassNames = rank =>
    classnames('label float-right', {
      'label-success': rank < 102,
      'label-warning': rank > 101 && rank < 500,
      'label-error': rank > 500
    });

export const fromRawLsk = value => (
  new BigNumber(value || 0).dividedBy(new BigNumber(10).pow(8)).toFixed()
);

export const toRawLsk = value => (
  new BigNumber(value * new BigNumber(10).pow(8).toNumber()).decimalPlaces(0).toNumber()
);

export const debounce = (fn, delay) => {
  let timer = null;
  return (...args) => {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
};

export const listDiff = (a, b) => a.filter(el => b.indexOf(el) === -1);

export const getUrl = () => {
  return `https://node0${getRandomArbitrary(1, 8)}.lisk.io`;
};
