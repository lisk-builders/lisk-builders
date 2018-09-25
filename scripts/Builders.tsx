import * as _ from 'lodash';
import * as React from 'react';
import { Component } from 'react';
import axios from 'axios';
import Banner from './Banner';
import Note from './Note';
import Panel from './Panel';
import Slack from './Slack';
import Container from './Container';
import * as delegates from '../data/delegates.json';
import * as notes from '../data/notes.json';
import { getUrl } from './utils';
import { client } from './api';

const getDelegateData = delegate =>
client().delegates.get({ username: delegate.delegateName })
    .then(
        res => {
          const data = res.data[0];
          if (data) {
            delegate.rank = data.rank;
            delegate.publicKey = data.account.publicKey;
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

export default class Builders extends Component<any, any> {

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
        <Banner />
        <div className="bg-gray">
          <Container>
            <Note note={notes.note1} />
          </Container>
        </div>
        <Container>
          {_.map(sortedData, Panel)}
        </Container>
        <Container withMargin>
          <Slack />
        </Container>
        <div className="bg-gray">
          <Container>
            <Note note={notes.note2} action />
          </Container>
        </div>
      </div>
    );
  }
}
