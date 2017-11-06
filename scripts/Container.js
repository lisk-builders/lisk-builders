import React from 'react';

const Container = props =>
    <div className="container grid-lg">
        <div className="columns">
            {props.children}
        </div>
    </div>;

export default Container;
