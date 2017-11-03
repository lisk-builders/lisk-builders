import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Slack from './Slack';
import Container from './Container';

class VoteManagerLogin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      address: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ address: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.history.push(`/votemanager/${this.state.address}`);
  }

  render() {
    return (
      <div>
        <Container>
          <div className="column">
            <div className="panel">
              <div className="panel-header"> </div>
              <div className="panel-body">
                <form onSubmit={this.handleSubmit} className="col-8 centered">
                  <div className="form-group">
                      <label className="form-label" htmlFor="input-example-1">Fill in your address to continue:</label>
                      <input className="form-input" value={this.state.address} onChange={this.handleChange} type="text" id="input-example-1" placeholder="Address" />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Continue</button>
                </form>
              </div>
              <div className="panel-footer"></div>
            </div>
          </div>
        </Container>
        <Container>
          <Slack />
        </Container>
      </div>
    );
  }
}

export default withRouter(VoteManagerLogin);
