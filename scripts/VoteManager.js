import React, { Component } from 'react';
import axios from 'axios';
import Slack from './Slack';
import Container from './Container';
import liskbuilders from '../data/delegates.json';
import groups from '../data/groups.json';
import { listDiff, debounce } from './utils';

const url = 'https://node01.lisk.io/api/delegates';

const delegateSet = {
  builders: liskbuilders.map(dg => dg.delegateName),
  gdt: groups.gdt,
  elite: groups.elite,
  sherwood: groups.shw
};

export default class VoteManager extends Component {

  constructor(props) {
    super(props);
    // @alepop from the other component where you need to fill in your address to "log in" I would like to receive:
    // a prop called initialVotes, which is the existing votes for that account
    this.state = {
      loaded: false,
      data: [],
      selectedDelegates: this.props.initialVotes ? this.props.initialVotes : [],
      selectedPage: 1,
      totalPages: 1,
      selectedSet: [],
      isSticky: false
    };
    this.debouncedSearch = debounce(this.search, 400).bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.stickyCounter = this.stickyCounter.bind(this);
    this.getVoteUnvoteList = this.getVoteUnvoteList.bind(this)
    this.offsetTop = null;
  }

  componentDidMount() {
    this.offsetTop = this.delegateCountRef.offsetTop;
    document.addEventListener('scroll', this.stickyCounter);
    this.navigate(1);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.stickyCounter);
  }

  stickyCounter() {
    const sticky = window.scrollY >= this.offsetTop;
    if (this.state.isSticky !== sticky) {
      this.setState({
        isSticky: sticky
      });
    }
  }

  getVoteUnvoteList() {
    const { initialVotes } = this.props;
    const voteList = this.state.selectedDelegates.join(',');
    let unvoteList = [];
    if (initialVotes) {
      unvoteList = initialVotes.filter(iv =>
        !this.state.selectedDelegates.find(dg => dg === iv)
      );
    }
    return {
      voteList,
      unvoteList: unvoteList.join(',')
    };
  }

  search(qs) {
    if (qs) {
      axios.get(`${url}/search?q=${qs}&orderBy=username:asc`)
        .then(res => {
          if (res.data.success) {
            this.setState({ data: res.data.delegates });
            return true;
          } else {
            return false;
          }
        })
        .catch(res => {
          console.warn(res);
        });
    } else {
      this.navigate(this.state.selectedPage);
    }
  }

  handleSearch(event) {
    this.debouncedSearch(event.target.value);
  }

  navigate(page) {
    axios.get(`${url}?limit=101&offset=${(page - 1) * 101}`)
      .then(res => {
        const totalPages = 1 + Math.floor((res.data.totalCount - 1) / 101);
        return this.setState({
          selectedPage: page,
          data: res.data.delegates,
          loaded: true,
          totalPages
        });
      })
      .catch(res => {
        console.warn(res);
      });
  }

  toggleDelegate = (delegate) => {
    let selectedDelegates = [...this.state.selectedDelegates];
    if (selectedDelegates.find(username => username === delegate.username)) {
      selectedDelegates = selectedDelegates.filter(dg =>
        dg !== delegate.username
      );
    } else {
      selectedDelegates.push(delegate.username);
    }
    this.setState({ selectedDelegates });
  }

  toggleDelegates(delegateUsernames, key) {
    const delegateDiff = this.getDelegatesDiff(delegateUsernames, key);
    const currentSelectedDelegates = [...this.state.selectedDelegates];
    const delegates = delegateDiff.length > 0 ?  delegateDiff : delegateUsernames;
    if (this.state.selectedSet.indexOf(key) === -1) {
      this.setState({
        selectedDelegates: currentSelectedDelegates.filter(el => delegates.indexOf(el) === -1)
      });
    } else {
      this.setState({
        selectedDelegates: [...currentSelectedDelegates, ...delegates]
      });
    }
  }

  getDelegatesDiff(delegateUsernames, key) {
    const selectedGroups = this.state.selectedSet
      .filter(k => k !== key)
      .map(k => delegateSet[k])
      .reduce((acc, group) => listDiff(acc, group), delegateUsernames);
    return selectedGroups;
  }

  isSelected(delegateUsername) {
    return this.state.selectedDelegates
      .find(username => username === delegateUsername) !== undefined;
  }

  selectPreset(key) {
    const delegates = delegateSet[key];
    this.setState(
      { selectedSet: this.state.selectedSet.includes(key) ?
        this.state.selectedSet.filter(el => el !== key) :
        [...this.state.selectedSet, key]
      }, this.toggleDelegates.bind(this, delegates, key));
  }

  resetSelectedDelegates() {
    this.setState({ selectedDelegates: [] });
  }

  getFilterData() {
    return [
      { title: 'Lisk Builders', set: 'builders' },
      { title: 'GDT', set: 'gdt' },
      { title: 'Elite', set: 'elite'},
      { title: 'Sherwood', set: 'sherwood' },
    ];
  }

  renderFilters() {
    return this.getFilterData().map(({ title, set }, i) => (
      <div className="col-6" key={i}>
        <label className="form-switch">
          <input type="checkbox" onChange={() => this.selectPreset(set)} />
          <i className="form-icon"></i> { title }
        </label>
      </div>
    ));
  };

  renderRow = (delegate) => (
    <tr key={delegate.rank} className={this.isSelected(delegate.username) ? 'active' : null} onClick={() => this.toggleDelegate(delegate)}>
      <td>
        <input type="checkbox" checked={this.isSelected(delegate.username)} onChange={() => true} />
        <i className="form-icon"></i>
      </td>
      <td>{delegate.rank}</td>
      <td>{delegate.username}</td>
      <td>{`${delegate.productivity}%`}</td>
      <td>{`${delegate.approval}%`}</td>
    </tr>
  );

  render() {
    const { voteList, unvoteList } = this.getVoteUnvoteList();
    return (
      <div>
        <Container>
          <div className="form-horizontal col-12">
            <div className="form-group">
              <div className="col-3">
                <label className="form-label" htmlFor="input-example-1">Address</label>
              </div>
              <div className="col-9">
                <input className="form-input" type="text" id="input-example-1" placeholder="Address" onKeyUp={this.handleSearch} />
              </div>
            </div>
            <div className="divider"></div>
            <div className="form-group">
              { this.renderFilters() }
            </div>
            <div className="divider"></div>
            <div className={`text-center ${this.state.isSticky ? 'sticky' : ''}`} ref={el => { this.delegateCountRef = el;}}>
              <span className={`label label-${this.state.selectedDelegates.length > 101 ? 'error' : 'primary'}`}>
                {this.state.selectedDelegates.length}/101 Votes
              </span>
            </div>
          </div>
        </Container>
        <Container>
          { !this.state.loaded ? <div className="loading" /> : null }
          <table className="table table-striped table-hover col-12">
            <thead>
              <tr>
                <th />
                <th>rank</th>
                <th>username</th>
                <th>productivity</th>
                <th>approval</th>
              </tr>
            </thead>
            <tbody>
              { this.state.loaded ? this.state.data.map(this.renderRow) : null }
            </tbody>
          </table>
          <div className="centered">
            <ul className="pagination">
              <li className="page-item">
                <a href="#scroll" tabIndex="-1" disabled={this.state.selectedPage <= 1} onClick={() => this.navigate(this.state.selectedPage - 1)}>Previous</a>
              </li>
              { this.state.selectedPage - 1 > 0 &&
                <li className="page-item">
                  <a href="#scroll" onClick={() => this.navigate(this.state.selectedPage - 1)}>{ this.state.selectedPage - 1 }</a>
                </li>
              }
              <li className="page-item active">
                <a href="#scroll" onClick={() => this.navigate(this.state.selectedPage )}>{ this.state.selectedPage }</a>
              </li>
              { this.state.selectedPage + 1 <= this.state.totalPages &&
                <li className="page-item">
                  <a href="#scroll" onClick={() => this.navigate(this.state.selectedPage + 1)}>{ this.state.selectedPage + 1 }</a>
                </li>
              }
              <li className="page-item">
                <span>...</span>
              </li>
              <li className="page-item">
                <a href="#scroll" onClick={() => this.navigate(this.state.totalPages)}>{this.state.totalPages}</a>
              </li>
              <li className="page-item">
                <a href="#scroll" disabled={this.state.selectedPage >= this.state.totalPages} onClick={(e) => this.navigate(this.state.selectedPage + 1)}>Next</a>
              </li>
            </ul>
          </div>
          {
            // @alepop the button to submit the votes should probably be here towards the bottom and should be disabled if selectedDelegates > 101
          }
        <Container>
          <Slack />
        </Container>
      </div>
    );
  }
}
