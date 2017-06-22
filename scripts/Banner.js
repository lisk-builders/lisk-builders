import React from 'react';
import Logo from './Logo';

const Stars = () => (
  <div>
    <div id='stars'></div>
    <div id='stars2'></div>
    <div id='stars3'></div>
    <Logo />
  </div>
);

const Banner = () => (
  <div className="">
    <section className="header">
      <Stars />
    </section>
  </div>
)

export default Banner;
