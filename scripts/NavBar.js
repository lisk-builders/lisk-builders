import React from 'react';
import { Link } from 'react-router-dom';
import Container from './Container';

const title = '{ lisk.builders }';
export default () => (
  <div className="nav-bar fixed">
    <Container>
      <div className="column col-12">
        <header className="navbar">
          <section className="navbar-section">
            <Link to="/" className="navbar-brand mr-10">{ title }</Link>
          </section>
          <section className="navbar-section">
            <Link to="/" className="btn btn-link">Builders</Link>
            <Link to="/contributions" className="btn btn-link">Contributions</Link>
          </section>
        </header>
      </div>
    </Container>
  </div>
);
