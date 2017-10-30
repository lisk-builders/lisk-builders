import React from 'react';
import { Logo } from './Logo';

const Stars = () =>
    <div>
        <div id="stars" />
        <div id="stars2" />
        <div id="stars3" />
        <Logo />
    </div>;

const Banner = (props) =>
    <div className="">
        <section className="header">
            <Stars />
        </section>
    </div>;

export default Banner;
