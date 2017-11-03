import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Builders from './Builders';
import Contributions from './Contributions';
import VoteManagerLogin from './VoteManagerLogin';
import VoteManager from './VoteManager';
import NavBar from './NavBar';

export default class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <div className="nav-bar-padding">
          <Switch>
            <Route exact path="/" render={() => <Builders />} />
            <Route exact path="/contributions" render={() => <Contributions />} />
            <Route exact path="/votemanager" render={() => <VoteManagerLogin />} />
            <Route path="/votemanager/:address" component={VoteManager} />
          </Switch>
        </div>
      </div>
    );
  }
}
