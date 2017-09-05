
import _ from 'lodash';
import React, { Component } from 'react';
import Banner from './Banner';
import Note from './Note';
import Panel from './Panel';
import Container from './Container';
import Lottery from './Lottery';
import notes from '../data/notes.json';
import axios from 'axios';
//<pool delegates={data}/>
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
          {/*<Lottery delegates={data} />*/}
          {_.map(data, Panel)}
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
