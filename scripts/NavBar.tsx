import * as React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';

const title = '{ lisk.builders }';
export default class NavBar extends Component<any, any> {

  menu: any;

  constructor(props) {
    super(props);
    this.state = {
      dropDownOpen: false
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.closeMenu);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeMenu);
  }

  closeMenu = (e) => {
    if (e.target !== this.menu && this.state.dropDownOpen) {
      this.setState({
        dropDownOpen: false
      });
    }
  }

  handleClick = (e) => {
    e.preventDefault();
    this.setState({
      dropDownOpen: true,
    });
  }


  render() {
    const { dropDownOpen } = this.state;
    return (
      <div className="nav-bar fixed">
        <div className="container grid-lg">
          <div className="columns">
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
                    <div className="dropdown dropdown-right active">
                      <a href="#menu" className="btn btn-link" tabIndex={0} onClick={this.handleClick} ref={el => this.menu = el}>
                        Menu <i className="icon icon-caret" />
                      </a>
                      { dropDownOpen &&
                          <ul className="menu">
                            <li><Link to="/" className="btn btn-link">Builders</Link></li>
                            <li><Link to="/contributions" className="btn btn-link">Contributions</Link></li>
                            <li><Link to="/votemanager" className="btn btn-link">Vote Manager</Link></li>
                          </ul>
                      }
                    </div>
                  </div>
                </section>
              </header>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
