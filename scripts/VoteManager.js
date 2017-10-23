import React, { Component } from 'react';
import axios from 'axios';
import Slack from './Slack';
import Container from './Container';

const url = 'https://node01.lisk.io/api/delegates';

const renderRow = (delegate) => (
  <tr key={delegate.rank} className="active">
    <td>{delegate.rank}</td>
    <td>{delegate.username}</td>
    <td>{`${delegate.productivity}%`}</td>
    <td>{`${delegate.approval}%`}</td>
  </tr>
);

export default class VoteManager extends Component {

  constructor() {
    super();
    this.state = {
      loaded: false,
      data: null
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
                <th>rank</th>
                <th>username</th>
                <th>productivity</th>
                <th>approval</th>
              </tr>
            </thead>
            <tbody>
              { this.state.loaded ? this.state.data.map(renderRow) : null }
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
