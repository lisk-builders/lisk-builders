import React, { Component } from 'react';
import axios from 'axios';
import Slack from './Slack';
import Container from './Container';
import delegates from '../data/delegates.json';
import groups from '../data/groups.json';

const url = 'https://node01.lisk.io/api/delegates';

export default class VoteManager extends Component {

  constructor() {
    super();
    this.state = {
      loaded: false,
      data: [],
      selectedDelegates: [],
      selectedPage: 1,
      totalPages: 1
    };
  }

  componentDidMount() {
    this.navigate(1);
  }

  navigate(page) {
    axios.get(`${url}?limit=101&offset=${(page - 1) * 101}`)
      .then(res => {
        const delegates = res.data.delegates.map(dg => {
          const delegate = { ...dg };
          delegate.selected = this.state.selectedDelegates.find(sd => sd === dg.username) !== undefined;
          return delegate;
        });
        const totalPages = 1 + Math.floor((res.data.totalCount - 1) / 101);
        return this.setState({
          selectedPage: page,
          data: delegates,
          loaded: true,
          totalPages
        });
      })
      .catch(res => {
        console.warn(res);
      });
  }

  toggleDelegate = (delegate) => {
    let selectedDelegates = [...this.state.selectedDelegates];
    if (selectedDelegates.find(username => username === delegate.username)) {
      selectedDelegates = selectedDelegates.filter(dg =>
        dg !== delegate.username
      );
    } else {
      selectedDelegates.push(delegate.username);
    }
    this.setState({ selectedDelegates });
  }

  selectDelegates(delegateUsernames) {
    const selectedDelegates = [...this.state.selectedDelegates];
    delegateUsernames.forEach(delegateUsername => {
      if (!selectedDelegates.find(username => username === delegateUsername)) {
        selectedDelegates.push(delegateUsername);
      }
    });
    this.setState({ selectedDelegates });
  }

  isSelected(delegateUsername) {
    return this.state.selectedDelegates.find(username => username === delegateUsername) !== undefined;
  }

  selectLiskBuilders() {
    const builders = delegates.map(dg => dg.delegateName);
    this.selectDelegates(builders);
  }

  selectGDT() {
    const GDT = groups.gdt;
    this.selectDelegates(GDT);
  }

  selectElite() {
    const elite = groups.elite;
    this.selectDelegates(elite);
  }

  selectShw() {
    const shw = groups.shw;
    this.selectDelegates(shw);
  }

  resetSelectedDelegates() {
    this.setState({ selectedDelegates: [] });
  }

  renderRow = (delegate) => (
    <tr key={delegate.rank} className={this.isSelected(delegate.username) ? 'active' : null} onClick={() => this.toggleDelegate(delegate)}>
      <td>
        <input type="checkbox" checked={this.isSelected(delegate.username)} onChange={() => true} />
        <i className="form-icon"></i>
      </td>
      <td>{delegate.rank}</td>
      <td>{delegate.username}</td>
      <td>{`${delegate.productivity}%`}</td>
      <td>{`${delegate.approval}%`}</td>
    </tr>
  );

  render() {
    return (
      <div>
        <Container>
          <form className="form-horizontal col-12">
            <div className="form-group">
              <div className="col-3">
                <label className="form-label" htmlFor="input-example-1">Address</label>
              </div>
              <div className="col-9">
                <input className="form-input" type="text" id="input-example-1" placeholder="Address" />
              </div>
            </div>
          </form>
          { !this.state.loaded ? <div className="loading" /> : null }
          <table className="table table-striped table-hover col-12">
            <thead>
              <tr>
                <th />
                <th>rank</th>
                <th>username</th>
                <th>productivity</th>
                <th>approval</th>
              </tr>
            </thead>
            <tbody>
              { this.state.loaded ? this.state.data.map(this.renderRow) : null }
            </tbody>
          </table>
          <div className="centered">
            <ul className="pagination">
              <li className="page-item">
                <a href="#scroll" tabIndex="-1" disabled={this.state.selectedPage <= 1} onClick={() => this.navigate(this.state.selectedPage - 1)}>Previous</a>
              </li>
              { this.state.selectedPage - 1 > 0 &&
                <li className="page-item">
                  <a href="#scroll" onClick={() => this.navigate(this.state.selectedPage - 1)}>{ this.state.selectedPage - 1 }</a>
                </li>
              }
              <li className="page-item active">
                <a href="#scroll" onClick={() => this.navigate(this.state.selectedPage )}>{ this.state.selectedPage }</a>
              </li>
              { this.state.selectedPage + 1 <= this.state.totalPages &&
                <li className="page-item">
                  <a href="#scroll" onClick={() => this.navigate(this.state.selectedPage + 1)}>{ this.state.selectedPage + 1 }</a>
                </li>
              }
              <li className="page-item">
                <span>...</span>
              </li>
              <li className="page-item">
                <a href="#scroll" onClick={() => this.navigate(this.state.totalPages)}>{this.state.totalPages}</a>
              </li>
              <li className="page-item">
                <a href="#scroll" disabled={this.state.selectedPage >= this.state.totalPages} onClick={(e) => this.navigate(this.state.selectedPage + 1)}>Next</a>
              </li>
            </ul>
          </div>
          <div className="btn-group btn-group-block col-12">
            <button className="btn" onClick={() => this.resetSelectedDelegates()}>Reset Selection</button>
            <button className="btn" onClick={() => this.selectLiskBuilders()}>Select Lisk.Builders</button>
            <button className="btn" onClick={() => this.selectGDT()}>Select GDT</button>
            <button className="btn" onClick={() => this.selectElite()}>Select Elite</button>
            <button className="btn" onClick={() => this.selectShw()}>Select Sherwood</button>
          </div>
        </Container>
        <Container>
          <Slack />
        </Container>
      </div>
    );
  }
}
