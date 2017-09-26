import _ from 'lodash';
import React, { Component } from 'react';
import Banner from './Banner';
import Builders from './Builders';
import Pool from './Pool';
import NavBar from './NavBar';
import { Route, Switch } from 'react-router-dom';

export default class App extends Component {
  render() {
    const { data } = this.props;
    return (
      <div>
        <NavBar />
        <Banner />
        <Switch>
          <Route exact path='/' render={() => <Builders data={data} />} />
          {/* <Route exact path='/pool' render={() => <Pool delegates={data} />} /> */}
        </Switch>
      </div>
    );
  }
}
