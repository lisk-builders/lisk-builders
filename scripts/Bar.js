import React from 'react';

const Bar = data => {
    console.log(data)
    return <div className="bar bar-sm">
        {Object.keys(data).map((key, i) =>
            <div key={i}
                className="bar-item tooltip"
                data-tooltip={`${key}% ${data[key]}`}
                role="progressbar"
                style={{width: `${key}%`}}>
            </div>,
        )}
    </div>;
}

export default Bar;
