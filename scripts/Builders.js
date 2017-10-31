import _ from 'lodash';
import React, { Component } from 'react';
import axios from 'axios';
import Note from './Note';
import Panel from './Panel';
import Slack from './Slack';
import Container from './Container';
import delegates from '../data/delegates.json';
import notes from '../data/notes.json';

const getDelegateData = delegate =>
axios
    .get(
        `https://node01.lisk.io/api/delegates/get?username=${delegate.delegateName}`,
    )
    .then(
        res => {
          const data = res.data.delegate;
          if (data) {
            delegate.rank = data.rank;
            delegate.publicKey = data.publicKey;
          }
          return delegate;
        }
    )
    .catch(res => delegate);

const getGitHubData = delegate =>
axios
    .get(`https://api.github.com/users/${delegate.githubUsername}`)
    .then(
        res =>
            (delegate.avatar_url = res.data.avatar_url
                ? res.data.avatar_url
                : undefined),
    )
    .catch(res => delegate);

export default class Builders extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    axios
    .all([...delegates.map(getDelegateData), ...delegates.map(getGitHubData)])
    .then(() => this.setState({ data: delegates }))
    .catch(console.warn);
  }

  render() {
    const sortedData = _.sortBy(this.state.data, ['rank']).reverse();
    return (
      <div>
        <div className="bg-gray">
          <Container>
            <Note {...notes.note1} />
          </Container>
        </div>
        <Container>
          {_.map(sortedData, Panel)}
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
