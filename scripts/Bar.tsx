import * as React from 'react';

const colors = {
    P: '#5764c6',
    D: '#818bd5',
    O: '#abb1e2',
};

const order = ['P', 'D', 'O'];

const tooltips = {
    P: 'pool',
    D: 'donations',
    O: 'personal',
};
const tooltip = data =>
    Object.keys(data)
        .sort((a, b) => (order.indexOf(a) > order.indexOf(b) ? 1 : -1))
        .map((key, i) => `${data[key]}% ${tooltips[key]}`)
        .join(' / ');

const Bar = data =>
    <div className="bar bar-sm tooltip" data-tooltip={tooltip(data)}>
        {Object.keys(data)
            .sort((a, b) => (order.indexOf(a) > order.indexOf(b) ? 1 : -1))
            .map((key, i) => {
              return (
                <div
                  key={i}
                  className="bar-item"
                  role="progressbar"
                  style={{
                    width: `${data[key]}%`,
                    backgroundColor: colors[key],
                  }}
                />
              );
            })}
    </div>;

export default Bar;
