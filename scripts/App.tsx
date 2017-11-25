import * as React from 'react';
import { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Builders from './Builders';
import Contributions from './Contributions';
import VoteManagerStore from '../stores/VoteManagerStore';
import VoteManagerLogin from './votemanager/VoteManagerLogin';
import VoteManager from './votemanager/VoteManager';
import NavBar from './NavBar';

export class App extends Component<any, any> {
  render() {
    return (
      <div>
        <NavBar />
        <div className="nav-bar-padding">
          <Switch>
            <Route exact path="/" render={() => <Builders />} />
            <Route exact path="/contributions" render={(props) => <Contributions {...props} />} />
            <Route exact path="/votemanager" render={(props) => <VoteManagerLogin {...props} />} />
            <Route path="/votemanager/:address" render={(props) => <VoteManager store={VoteManagerStore} {...props} />} />
          </Switch>
        </div>
      </div>
    );
  }
}
