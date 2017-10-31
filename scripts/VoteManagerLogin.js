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
    console.log(event);
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
          <form onSubmit={this.handleSubmit}>
            <div className="form-horizontal col-12">
              <div className="form-group">
                <div className="col-3">
                  <label className="form-label" htmlFor="input-example-1">Fill in your address to continue:</label>
                </div>
                <div className="col-9">
                  <input className="form-input" value={this.state.address} onChange={this.handleChange} type="text" id="input-example-1" placeholder="Address" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Continue</button>
            </div>
          </form>
        </Container>
        <Container>
          <Slack />
        </Container>
      </div>
    );
  }
}

export default withRouter(VoteManagerLogin);
