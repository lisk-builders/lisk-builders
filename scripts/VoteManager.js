import React, { Component } from 'react';
import axios from 'axios';
import Slack from './Slack';
import Container from './Container';

const url = 'https://node01.lisk.io/api/delegates';

export default class VoteManager extends Component {

  constructor() {
    super();
    this.state = {
      loaded: false,
      data: [],
      selectedDelegates: []
    };
  }

  componentDidMount() {
    axios.get(`${url}?limit=101&offset=0`)
      .then(res => this.setState({
        data: res.data.delegates,
        loaded: true
      }))
      .catch(res => {
        console.warn(res);
      });
  }

  selectDelegate = (delegate) => {
    let delegates = [];
    let selectedDelegates = [];
    if (delegate.selected) {
      selectedDelegates = this.state.selectedDelegates.filter(dg =>
        dg !== delegate.username
      );
    } else {
      selectedDelegates.push(delegate.username);
    }
    delegates = this.state.data.map(dg => {
      const newDg = dg;
      if (dg.username === delegate.username) {
        newDg.selected = !newDg.selected;
      }
      return newDg;
    });
    this.setState({delegates, selectedDelegates });
  }

  renderRow = (delegate) => (
    <tr key={delegate.rank} className={delegate.selected ? 'active' : null} onClick={() => this.selectDelegate(delegate)}>
      <td>
        <input type="checkbox" checked={!!delegate.selected} />
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
          <table className="table table-striped table-hover">
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
        </Container>
        <Container>
          <Slack />
        </Container>
      </div>
    );
  }
}
