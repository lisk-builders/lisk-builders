import * as React from 'react';

const Container = props =>
    <div className={`container grid-lg ${props.withMargin ? "my-2": "" }`}>
        <div className="columns">
            {props.children}
        </div>
    </div>;

export default Container;
