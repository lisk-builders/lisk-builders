import _ from 'lodash';
import React, { Component } from 'react';
import axios from 'axios';
import Slack from './Slack';
import Container from './Container';
import liskbuilders from '../data/delegates.json';
import groups from '../data/groups.json';
import { listDiff, debounce, getUrl } from './utils';
import * as consts from '../data/consts.json';

const delegateSet = {
  builders: liskbuilders.map(dg => dg.delegateName),
  gdt: groups.gdt,
  elite: groups.elite,
  sherwood: groups.shw
};

export default class VoteManager extends Component {

  static getFilterData() {
    return [
      { title: 'Lisk Builders', set: 'builders' },
      { title: 'GDT', set: 'gdt' },
      { title: 'Elite', set: 'elite'},
      { title: 'Sherwood', set: 'sherwood' },
    ];
  }

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      data: [],
      selectedDelegates: [],
      initialVotes: [],
      pages: [],
      selectedPage: 1,
      totalPages: 1,
      selectedSet: [],
      isSticky: false,
      groupIsShown: null,
      showExportModal: false,
      showImportModal: false,
      votesToImport: ''
    };
    this.debouncedSearch = debounce(this.search.bind(this), 400).bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.stickyCounter = this.stickyCounter.bind(this);
    this.getVoteUnvoteList = this.getVoteUnvoteList.bind(this)
    this.offsetTop = null;
  }

  componentDidMount() {
    this.offsetTop = this.delegateCountRef.offsetTop;
    document.addEventListener('scroll', this.stickyCounter);
    if (this.props.match.params.address) {
      this.getVotesForAddress(this.props.match.params.address).then(res => {
        this.navigate(1);
      });
    } else {
      this.navigate(1);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.stickyCounter);
  }

  getVotesForAddress(address) {
    return axios.get(`${getUrl()}/api/accounts/delegates/?address=${address}`).then(res => {
      if (res.data.success) {
        const initialVotes = res.data.delegates.map(dg => dg.username);
        this.setState({ selectedDelegates: initialVotes, initialVotes }, this.updateSelectedSets);
        return true;
      } else {
        return false;
      }
    }).catch(err => {
      console.warn(err);
    })
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
    const { initialVotes, selectedDelegates } = this.state;
    const voteList = listDiff(selectedDelegates, initialVotes);
    let unvoteList = [];
    if (initialVotes) {
      unvoteList = initialVotes.filter(iv =>
        !selectedDelegates.find(dg => dg === iv)
      );
    }
    const data = [
      ...unvoteList.map(name => ({ type: 'unvote', name })),
      ...voteList.map(name => ({ type: 'vote', name }))
    ];
    return _.chunk(data, 33);
  }

  search(qs) {
    if (qs) {
      axios.get(`${getUrl()}/api/delegates/search?q=${qs}&orderBy=username:asc`)
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

  async searchInPages(delegates) {
    let foundDelegates = [];
    for (let i = 1; i <= this.state.totalPages; i += 1) {
      const page = await this.getPage(i);
      foundDelegates = [...foundDelegates, ...page.reduce((acc, dg) => {
        if (delegates.find(username => dg.username === username)) {
          acc.push(dg);
          return acc;
        }
        return acc;
      }, [])];
      if (foundDelegates.length === delegates.length) {
        break;
      }
    }
    return foundDelegates;
  }

  getPage(page) {
    const existingPage = this.state.pages.find(pg => pg.id === page);
    if (!existingPage) {
      return axios.get(`${getUrl()}/api/delegates?limit=${consts.maxAllowedVotes}&offset=${(page - 1) * consts.maxAllowedVotes}`)
      .then(res => {
        const totalPages = 1 + Math.floor((res.data.totalCount - 1) / consts.maxAllowedVotes);
        this.setState({
          pages: [...this.state.pages, { id: page, delegates: res.data.delegates }],
          totalPages: page === 1 ? totalPages : this.state.totalPages,
        });
        return res.data.delegates;
      });
    } else {
      return Promise.resolve(existingPage.delegates);
    }
  }

  navigate(page) {
    this.getPage(page).then(data => {
      return this.setState({
        selectedPage: page,
        data,
        loaded: true,
        groupIsShown: null
      });
    }).catch(res => {
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
    this.setState({ selectedDelegates }, this.updateSelectedSets);
  }

  toggleDelegates(delegateUsernames, key) {
    const delegateDiff = this.getDelegatesDiff(delegateUsernames, key);
    const currentSelectedDelegates = [...this.state.selectedDelegates];
    const delegates = delegateDiff.length > 0 ? delegateDiff : delegateUsernames;
    if (this.state.selectedSet.indexOf(key) === -1) {
      this.setState({
        selectedDelegates: currentSelectedDelegates.filter(el => delegates.indexOf(el) === -1)
      });
    } else {
      this.setState({
        selectedDelegates: _.uniq([...currentSelectedDelegates, ...delegates])
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

  showGroup(key) {
    if (this.state.groupIsShown !== key) {
      this.searchInPages(delegateSet[key])
      //Promise.all(delegateSet[key].map(username => axios.get(`${getUrl()}/api/delegates/get?username=${username}`)))
      .then(res => this.setState({ data: res, groupIsShown: key }))
      .catch(err => console.warn(err));
    } else {
      this.navigate(this.state.selectedPage);
    }
  }

  resetSelectedDelegates() {
    this.setState({ selectedDelegates: this.state.initialVotes }, this.updateSelectedSets);
  }

  wipeSelectedDelegates() {
    this.setState({ selectedDelegates: [] }, this.updateSelectedSets);
  }

  selectCurrentPage() {
    this.setState({ selectedDelegates: _.uniq([...this.state.selectedDelegates,
      ...this.state.data.map(dg => dg.username)]) }, this.updateSelectedSets);
  }

  openModal(modal) {
    if (modal === 'export') {
      this.setState({ showExportModal: true });
    }
    if (modal === 'import') {
      this.setState({ showImportModal: true });
    }
  }

  closeModal(modal) {
    if (modal === 'export') {
      this.setState({ showExportModal: false });
    }
    if (modal === 'import') {
      this.setState({ showImportModal: false });
    }
  }

  importVotes() {
    this.setState({ selectedDelegates: this.state.votesToImport.split(','), showImportModal: false });
  }

  updateSelectedSets() {
    let selectedSet = this.state.selectedSet;
    Object.keys(delegateSet).forEach(set => {
      const foundVotes = this.state.selectedDelegates.reduce((acc, iv) => {
        if (delegateSet[set].find(username => username === iv)) {
          acc.push(iv);
          return acc;
        } else {
          return acc;
        }
      }, []);
      if (foundVotes.length === delegateSet[set].length) {
        selectedSet.push(set);
      } else {
        selectedSet = selectedSet.filter(entry => entry !== set);
      }
    });
    this.setState({ selectedSet });
  }

  renderFilters() {
    return VoteManager.getFilterData().map(({ title, set }, i) => (
      <div className="col-6" key={i}>
        <label className="form-switch">
          <input type="checkbox" checked={this.state.selectedSet.includes(set)} onChange={() => this.selectPreset(set)} />
          <i className="form-icon"></i> { title }
        </label>
        <button className="btn btn-link btn-sm" onClick={() => this.showGroup(set)}>{ this.state.groupIsShown === set ? 'Hide' : 'Show' }</button>
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

  renderVoteButtons = (data) => {
    const getNames = (groups) =>
      groups.map(el => el.name).join(',');
    return (
      <div>
        <div className="divider"></div>
        {
          this.state.selectedDelegates.length <= consts.maxAllowedVotes ? data.map(votes => _.groupBy(votes, 'type'))
            .map((group, i) => (
              <span style={{marginRight: 4}} key={i}>
              <lisk-button-vote votes={group.vote ? getNames(group.vote) : ''}
                unvotes={group.unvote ? getNames(group.unvote) : ''}></lisk-button-vote>
            </span>)) : `You cannot vote for more than ${consts.maxAllowedVotes} delegates, please reduce your selection.`
        }
        <div className="divider"></div>
      </div>
    );
  }

  render() {
    const voteData = this.getVoteUnvoteList();
    return (
      <div>
        <Container>
          <div className="form-horizontal col-12">
            <div className="form-group">
              <div className="col-3">
                <label className="form-label" htmlFor="input-example-1">Search for a delegate:</label>
              </div>
              <div className="col-9">
                <input className="form-input" type="text" id="input-example-1" placeholder="Delegate" onKeyUp={this.handleSearch} />
              </div>
            </div>
            <div className="divider"></div>
            <div className="form-group">
              { this.renderFilters() }
            </div>
            <div className="divider"></div>
            <button className="btn btn-primary" onClick={() => this.resetSelectedDelegates()}>Reset</button>
            <button className="btn btn-secondary" onClick={() => this.wipeSelectedDelegates()}>Wipe</button>
            <button className="btn btn-secondary" onClick={() => this.selectCurrentPage()}>Select Current Page</button>
            <button className="btn btn-secondary" onClick={() => this.openModal('import')}>Import Votes</button>
            <button className="btn btn-secondary" onClick={() => this.openModal('export')}>Export Votes</button>
            { !!voteData.length && this.renderVoteButtons(voteData) }
            <div className={`text-center ${this.state.isSticky ? 'sticky' : ''}`} ref={el => { this.delegateCountRef = el;}}>
              <span className={`label label-${this.state.selectedDelegates.length > consts.maxAllowedVotes ? 'error' : 'primary'}`}>
                {this.state.selectedDelegates.length}/{consts.maxAllowedVotes} Votes
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
        </Container>
        <Container>
          <Slack />
        </Container>
        <div className={`modal ${this.state.showExportModal ? 'active' : ''}`}>
          <div className="modal-overlay"></div>
          <div className="modal-container">
            <div className="modal-header">
              <button className="btn btn-clear float-right" onClick={() => this.closeModal('export')}></button>
              <div className="modal-title h5">Export</div>
            </div>
            <div className="modal-body">
              <div className="content">
                <div className="form-group">
                  <label className="form-label" htmlFor="input-example-3">Votes</label>
                  <textarea className="form-input" readOnly id="input-example-3" placeholder="Votes" rows="8" cols="50" value={this.state.selectedDelegates} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`modal ${this.state.showImportModal ? 'active' : ''}`}>
          <div className="modal-overlay"></div>
          <div className="modal-container">
            <div className="modal-header">
              <button className="btn btn-clear float-right" onClick={() => this.closeModal('import')}></button>
              <div className="modal-title h5">Import</div>
            </div>
            <div className="modal-body">
              <div className="content">
                <div className="form-group">
                  <label className="form-label" htmlFor="input-example-3">Votes</label>
                  <textarea className="form-input" id="input-example-3" placeholder="Votes" rows="8" cols="50" onChange={(e) => this.setState({ votesToImport: e.target.value }) } />
                  <button className="btn btn-secondary" onClick={() => this.importVotes()}>Import</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
