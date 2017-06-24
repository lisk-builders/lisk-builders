import React from 'react';

const Container = props =>
    <div className="container grid-960">
        <div className="columns">
            {props.children}
        </div>
    </div>;

export default Container;
