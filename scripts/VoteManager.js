import _ from 'lodash';
import 'regenerator-runtime/runtime';
import React, { Component } from 'react';
import axios from 'axios';
import Joyride from 'react-joyride';
import Slack from './Slack';
import Container from './Container';
import Toast from './Toast';
import liskbuilders from '../data/delegates.json';
import groups from '../data/groups.json';
import { listDiff, debounce, getUrl } from './utils';
import * as consts from '../data/consts.json';

const delegateSet = {
  builders: groups.builders.data,
  gdt: groups.gdt.data,
  elite: groups.elite.data,
  sherwood: groups.shw.data,
  dutchpool: groups.dutchpool.data,
  alepop5an1ty: ['alepop', '5an1ty'],
  payoutoptimized: _.uniq([...groups.gdt.data, ...groups.elite.data, ...groups.shw.data, 'thepool', 'liskpool_com_01', 'liskpool.top', 'shinekami', 'vipertkd', 'vrlc92', 'communitypool', 'devasive', 'samuray', 'vega', 'phoenix1969']) // 'bitbanksy', 'stellardynamic'
};

const toastText = 'Do you like this tool? vote alepop & 5an1ty!';

export default class VoteManager extends Component {

  static getFilterData() {
    return [
      { title: 'Lisk Builders', set: 'builders', tooltip: 'Active contributors to lisk' },
      { title: 'GDT', set: 'gdt', tooltip: 'More info: https://pool.liskgdt.net' },
      { title: 'Elite', set: 'elite', tooltip: 'Requires verifying yourself on https://liskelite.com' },
      { title: 'Sherwood', set: 'sherwood', tooltip: 'More info: http://robinhood.liskpro.com' },
      { title: 'alepop & 5an1ty', set: 'alepop5an1ty', tooltip: 'The creators of this site ;-)' },
      { title: 'Dutch Pool', set: 'dutchpool', tooltip: 'More info: http://lisk.dutchpool.io/' }
    ];
  }

  constructor(props) {
    super(props);
    let canUseLocalStorage = true;
    try {
      localStorage.getItem('localStorageTest');
    } catch (e) {
      canUseLocalStorage = false;
    }
    this.state = {
      canUseLocalStorage,
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
      showSummaryModal: false,
      votesToImport: '',
      runIntro: canUseLocalStorage ? localStorage.getItem('voteManagerIntroDone') !== 'true' : false,
      introType: 'continuous',
      introSkipButton: true,
      introDisableOverlay: true,
      introSteps: [
        {
          selector: '#intro-starter',
          text: 'Welcome to our vote manager tool, let\'s take a tour...'
        },
        {
          selector: '#input-search',
          text: 'You can search for a specific delegate here.'
        },
        {
          selector: '#intro-filters-block',
          text: 'These are toggles to select / deselect entire groups.'
        },
        {
          selector: '#intro-restore-btn',
          text: 'Restore the tool to your original votes.'
        },
        {
          selector: '#intro-unvote-btn',
          text: 'Unvote all delegates you currently vote for.'
        },
        {
          selector: '#intro-optimize-btn',
          text: 'Select a payment optimized set of delegates.'
        },
        {
          selector: '#intro-selectpage-btn',
          text: 'Select all delegates on the current page.'
        },
        {
          selector: '#intro-deselectpage-btn',
          text: 'Deselect all delegates on the current page.'
        },
        {
          selector: '#intro-import-btn',
          text: 'Import a comma seperated list of delegates to start from a template.'
        },
        {
          selector: '#intro-export-btn',
          text: 'Export a comma seperated list of delegates.'
        },
        {
          selector: '#intro-vote-btn',
          text: 'After making changes to your votes, you will see clickable buttons here to send your votes to Lisk Nano in batches of 33 changes / button.'
        },
        {
          selector: '#intro-summary-btn',
          text: 'See a summary of all the changes to your votes.'
        },
        {
          selector: '#intro-vote-section',
          text: 'Do not hesitate to click the vote buttons, Lisk Nano will ask you to confirm before sending the transaction.'
        }
      ]
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

  setData(data, cb) {
    const newData = data.map(d => {
      const newDelegate = { ...d };
      newDelegate.groups = [];
      Object.keys(groups).forEach(ds => {
        const found = groups[ds].data.find(username => username === d.username);
        if (found) {
          newDelegate.groups.push(ds);
        }
      });
      return newDelegate;
    });
    this.setState({ data: newData }, cb);
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
            this.setData(res.data.delegates);
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
      return this.setData(data, () => {
        this.setState({
          selectedPage: page,
          loaded: true,
          groupIsShown: null
        }, this.intro);
      });
    }).catch(res => {
      console.warn(res);
    });
  }

  handleIntroChange(data) {
    if (data.type === 'finished') {
      window.scrollTo(0, 0);
      if (this.state.canUseLocalStorage) {
        localStorage.setItem('voteManagerIntroDone', 'true');
      }
    }
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
      }, this.updateSelectedSets);
    } else {
      this.setState({
        selectedDelegates: _.uniq([...currentSelectedDelegates, ...delegates])
      }, this.updateSelectedSets);
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
      .then(res => this.setData(res, () => this.setState({ groupIsShown: key })))
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

  deselectCurrentPage() {
    const filtered = this.state.selectedDelegates.filter(username =>
      !this.state.data.find(dg => dg.username === username));
    this.setState({ selectedDelegates: filtered }, this.updateSelectedSets);
  }

  openModal(modal) {
    if (modal === 'export') {
      this.setState({ showExportModal: true });
    }
    if (modal === 'import') {
      this.setState({ showImportModal: true });
    }
    if (modal === 'summary') {
      this.setState({ showSummaryModal: true });
    }
  }

  closeModal(modal) {
    if (modal === 'export') {
      this.setState({ showExportModal: false });
    }
    if (modal === 'import') {
      this.setState({ showImportModal: false });
    }
    if (modal === 'summary') {
      this.setState({ showSummaryModal: false });
    }
  }

  importVotes() {
    this.setState({ selectedDelegates: this.state.votesToImport.split(','), showImportModal: false }, this.updateSelectedSets);
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

  setSelectedToOptimized() {
    this.setState({ selectedDelegates: delegateSet.payoutoptimized }, this.updateSelectedSets);
  }

  renderFilters() {
    return VoteManager.getFilterData().map(({ title, set, tooltip }, i) => (
      <div className="column col-4 col-xs-6" key={i}>
        <label className={`form-switch ${tooltip ? 'tooltip' : ''}`} data-tooltip={tooltip}>
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
      <td>{ 
        delegate.groups.map((gp, i) => {
          return (<span key={i} className={`chip ${groups[gp].color}`}>{groups[gp].fullname}</span>);
        })
      }</td>
      <td className="hide-sm">{`${delegate.productivity}%`}</td>
      <td>{`${delegate.approval}%`}</td>
    </tr>
  );

  renderVoteButtons = (data) => {
    const getNames = (groups) =>
      groups.map(el => el.name).join(',');
    return (
      <div>
        <div className="tooltip" data-tooltip={`${consts.votingFee} LSK transaction fee per batch of ${consts.maxVotesInOneBatch} votes`}>
          { !data.length && (<button style={{ marginRight: 4 }} className="btn btn-secondary" disabled id="intro-vote-btn">Step 1: -0, +0</button>) }
          {
            this.state.selectedDelegates.length <= consts.maxAllowedVotes ? data.map(votes => _.groupBy(votes, 'type'))
              .map((group, i) => (
                <span style={{ marginRight: 4 }} key={i}>
                  <lisk-button-vote
                    votes={group.vote ? getNames(group.vote) : ''} unvotes={group.unvote ? getNames(group.unvote) : ''}
                    title={`Step ${i + 1}: ${group.unvote ? `-${group.unvote.length}` : ''}${group.vote && group.unvote ? `, +${group.vote.length}` : ''}${group.vote && !group.unvote ? `+${group.vote.length}` : ''}`}
                  />
                </span>)) : `You cannot vote for more than ${consts.maxAllowedVotes} delegates, please reduce your selection.`
          }
          <button className="btn btn-secondary" disabled={!data.length} id="intro-summary-btn" onClick={() => this.openModal('summary')}>Summary</button>
        </div>
      </div>
    );
  }

  render() {
    const voteData = this.getVoteUnvoteList();
    const flatVoteData = [].concat(...voteData);
    return (
      <div>
        <Joyride
          ref={() => 'joyride'}
          scrollOffset={54}
          type={this.state.introType}
          run={this.state.runIntro}
          autoStart={this.state.runIntro}
          showOverlay={() => true}
          showSkipButton={this.state.introSkipButton}
          disableOverlay={this.state.introDisableOverlay}
          steps={this.state.introSteps}
          callback={(p) => this.handleIntroChange(p)}
        />
        <Toast text={toastText} timer={5000} />
        <Container>
          <div className="form-horizontal">
            <div className="form-group" id="intro-starter">
              <div className="col-3">
                <label className="form-label" htmlFor="input-search">Search for a delegate:</label>
              </div>
              <div className="col-9">
                <input className="form-input" type="text" id="input-search" placeholder="Delegate" onKeyUp={this.handleSearch} />
              </div>
            </div>
            <div className="divider" />
            <div className="columns" id="intro-filters-block">
              { this.renderFilters() }
            </div>
            <div className="divider" />
            <div className="btn-group btn-group-block">
              <button className="btn btn-secondary" id="intro-restore-btn" onClick={() => this.resetSelectedDelegates()}>Restore</button>
              <button className="btn btn-secondary" id="intro-unvote-btn" onClick={() => this.wipeSelectedDelegates()}>Unvote All</button>
              <button className="btn btn-secondary tooltip" id="intro-optimize-btn" data-tooltip="Vote for the highest paying delegates" onClick={() => this.setSelectedToOptimized()}>Vote For Maximum Payouts</button>
              <button className="btn btn-secondary" id="intro-selectpage-btn" onClick={() => this.selectCurrentPage()}>Select Current Page</button>
              <button className="btn btn-secondary" id="intro-deselectpage-btn" onClick={() => this.deselectCurrentPage()}>Deselect Current Page</button>
            </div>
            <div className="divider" />
            <div className="btn-group btn-group-block">
              <button className="btn btn-secondary" id="intro-import-btn" onClick={() => this.openModal('import')}>Import Votes</button>
              <button className="btn btn-secondary" id="intro-export-btn" onClick={() => this.openModal('export')}>Export Votes</button>
            </div>
            <div className="divider" />
            <p>When finished, send your changes to Lisk Nano by clicking the buttons below in sequence. You will get an overview of the votes you are sending in Nano before you actually submit the votes:</p>
            <div id="intro-vote-section">
              { this.renderVoteButtons(voteData) }
            </div>
            <p><br />Status:&nbsp;
            { this.state.selectedSet.includes('elite') ? <span><strong>Warning!</strong> You have voted for Elite, you must verify your address on the Elite <a target="_blank" rel="noopener noreferrer" href="https://liskelite.com">website</a> to make sure you receive your payout.</span> : 'Everything ok!' }
            </p>
            <div className="divider" />
            <div className={`text-center ${this.state.isSticky ? 'sticky' : ''}`} ref={el => { this.delegateCountRef = el; }}>
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
                <th>groups</th>
                <th className="hide-sm">productivity</th>
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
                <a href="#scroll" onClick={() => this.navigate(this.state.selectedPage)}>{ this.state.selectedPage }</a>
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
                <a href="#scroll" disabled={this.state.selectedPage >= this.state.totalPages} onClick={() => this.navigate(this.state.selectedPage + 1)}>Next</a>
              </li>
            </ul>
          </div>
        </Container>
        <Container>
          <Slack />
        </Container>
        <div className={`modal ${this.state.showExportModal ? 'active' : ''} modal-sm`}>
          <div className="modal-overlay" />
          <div className="modal-container">
            <div className="modal-header">
              <button className="btn btn-clear float-right" onClick={() => this.closeModal('export')} />
              <div className="modal-title h5">Export</div>
            </div>
            <div className="modal-body">
              <div className="content">
                <div className="form-group">
                  <label className="form-label" htmlFor="input-example-3">Votes</label>
                  <textarea className="form-input" readOnly id="input-example-3" placeholder="Votes" rows="8" cols="50" value={this.state.selectedDelegates} />
                </div>
                <div className="form-group">
                  <a href={`mailto:?subject=Hey, Here's a list with great Lisk delegates you can vote for!&body=You can use the lisk.builders vote manager to easily manage your votes (https://lisk.builders/votemanager). Press the import button and paste this list: %0D%0A%0D%0A${this.state.selectedDelegates}`} className="btn btn-primary">Send via email</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`modal ${this.state.showImportModal ? 'active' : ''} modal-sm`}>
          <div className="modal-overlay" />
          <div className="modal-container">
            <div className="modal-header">
              <button className="btn btn-clear float-right" onClick={() => this.closeModal('import')} />
              <div className="modal-title h5">Import</div>
            </div>
            <div className="modal-body">
              <div className="content">
                <div className="form-group">
                  <label className="form-label" htmlFor="input-example-3">Votes</label>
                  <textarea className="form-input" id="input-example-3" placeholder="Votes" rows="8" cols="50" onChange={(e) => this.setState({ votesToImport: e.target.value })} />
                </div>
                <div className="form-group">
                  <button className="btn btn-secondary" onClick={() => this.importVotes()}>Import</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`modal ${this.state.showSummaryModal ? 'active' : ''} modal-sm`}>
          <div className="modal-overlay" />
          <div className="modal-container">
            <div className="modal-header">
              <button className="btn btn-clear float-right" onClick={() => this.closeModal('summary')} />
              <div className="modal-title h5">Summary</div>
            </div>
            <div className="modal-body">
              <div className="content">
                <p>
                  <strong>Added votes:</strong> {flatVoteData.filter(v => v.type === 'vote').map(v => v.name).join(' ')}
                </p>
                <p>
                  <strong>Removed votes:</strong> {flatVoteData.filter(v => v.type === 'unvote').map(v => v.name).join(' ')}
                </p>
              </div>
            </div>
            <div className="modal-footer"></div>
          </div>
        </div>
      </div>
    );
  }
}
