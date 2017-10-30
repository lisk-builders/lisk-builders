import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Banner from './Banner';
import Builders from './Builders';
import Contributions from './Contributions';
import NavBar from './NavBar';

export default class App extends Component {
  render() {
    const { data } = this.props;
    return (
      <div>
        <NavBar />
        <Banner />
        <Switch>
          <Route exact path="/" render={() => <Builders data={data} />} />
          <Route exact path="/contributions" render={() => <Contributions />} />
        </Switch>
      </div>
    );
  }
}
