import React from 'react';

const colors = ["#5764c6", "#818bd5", "#abb1e2"]
const Bar = data => {
    console.log(data)
    return <div className="bar custom-bar">
        {Object.keys(data).sort((a,b) => a < b).map((key, i) =>
            <div key={i}
                className="bar-item tooltip"
                data-tooltip={`${key}% ${data[key]}`}
                role="progressbar"
                style={{width: `${key}%`, backgroundColor: colors[i]}}>{key}%
            </div>,
        )}
    </div>;
}

export default Bar;
