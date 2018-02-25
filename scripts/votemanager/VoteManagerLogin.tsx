import * as React from 'react';
import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as notes from '../../data/notes.json';
import Note from '../Note';
import Slack from '../Slack';
import Container from '../Container';

class VoteManagerLogin extends Component<any, any> {

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
        <div className="bg-gray">
          <Container>
            <Note note={notes.note5} centered />
          </Container>
        </div>
        <Container withMargin>
          <div className="column">
            <div className="panel">
              <div className="panel-header" />
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
        <Container withMargin>
          <Slack />
        </Container>
        <div className="bg-gray">
          <Container>
            <Note note={notes.note6} centered />
          </Container>
        </div>
      </div>
    );
  }
}

export default withRouter(VoteManagerLogin);
