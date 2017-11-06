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
            <div className="hide-md">
              <Link to="/" className="btn btn-link">Builders</Link>
              <Link to="/contributions" className="btn btn-link">Contributions</Link>
              <Link to="/votemanager" className="btn btn-link">Vote Manager</Link>
            </div>
            <div className="show-md">
              <div className="dropdown dropdown-right">
                <a href="#menu" className="btn btn-link dropdown-toggle" tabIndex="0">
                  Menu <i className="icon icon-caret" />
                </a>
                <ul className="menu">
                  <li><Link to="/" className="btn btn-link">Builders</Link></li>
                  <li><Link to="/contributions" className="btn btn-link">Contributions</Link></li>
                  <li><Link to="/votemanager" className="btn btn-link">Vote Manager</Link></li>
                </ul>
              </div>
            </div>
          </section>
        </header>
      </div>
    </Container>
  </div>
);
