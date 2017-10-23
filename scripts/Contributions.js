import React, { Component } from 'react';
import axios from 'axios';
import Note from './Note';
import Slack from './Slack';
import Container from './Container';
import { GitHub } from './Icons';
import notes from '../data/notes.json';

const url = 'https://api.github.com/orgs/lisk-builders/repos';

const renderProject = ({ id, name, description, language, updated_at, html_url, open_issues }) => (
  <div key={id} className="column col-xs-12 col-sm-12 col-md-6 col-4">
    <div className="panel rel">
      <div className="panel-header">
        <div className="panel-title mt-10">{ name } </div>
        <div className="panel-subtitle">{ description }</div>
      </div>
      <div className="panel-body">
        <div className="tile tile-centered">
          <div className="tile-content">
            <span className="tile-title">Language</span>
            <label className="label float-right">{ language }</label>
          </div>
        </div>
        <div className="divider" />
        <div className="tile tile-centered">
          <div className="tile-content">
            <span className="tile-title">Open Issues</span>
            <label className="label float-right">{ open_issues }</label>
          </div>
        </div>
        <div className="divider" />
        <div className="tile tile-centered">
          <div className="tile-content">
            <span className="tile-title">Updated at</span>
            <label className="label float-right">{ new Date(updated_at).toLocaleDateString() }</label>
          </div>
        </div>
      </div>
      <div className="panel-footer">
        <a
          className="btn btn-sm btn-block"
          target="_blank"
          href={html_url}>
          <GitHub /> Source
        </a>
      </div>
    </div>
  </div>
);

export default class Contributions extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      data: null
    };
  }

  componentDidMount() {
    axios.get(url)
      .then(res => this.setState({
        data: res.data,
        loaded: true
      }))
      .catch(res => {
        console.warn(res);
      });
  }
  render() {
    return (
      <div>
        <div className="bg-gray">
          <Container>
            <Note {...notes.note4} />
          </Container>
        </div>
        <Container>
          {
            !this.state.loaded ?
              <div className="loading"></div> :
              this.state.data.map(renderProject)
          }
        </Container>
        <Container>
          <Slack />
        </Container>
      </div>
    );
  }
}
