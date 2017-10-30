import _ from 'lodash';
import React, { Component } from 'react';
import Note from './Note';
import Panel from './Panel';
import Slack from './Slack';
import Container from './Container';
import notes from '../data/notes.json';

export default class Builders extends Component {
  render() {
    const { data } = this.props;
    return (
      <div>
        <div className="bg-gray">
          <Container>
            <Note {...notes.note1} />
          </Container>
        </div>
        <Container>
          {_.map(data, Panel)}
        </Container>
        <Container>
          <Slack />
        </Container>
        <div className="bg-gray">
          <Container>
            <Note {...notes.note2} action="test" />
          </Container>
        </div>
      </div>
    );
  }
}
