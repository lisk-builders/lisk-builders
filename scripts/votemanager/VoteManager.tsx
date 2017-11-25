import * as _ from 'lodash';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import { Component } from 'react';
import axios from 'axios';
import { observer } from 'mobx-react';
import Slack from '../Slack';
import Container from '../Container';
import Toast from '../Toast';
import * as dposdata from '../../dpos-tools-data/lisk/pools.json';
import * as groups from '../../data/groups.json';
import { listDiff, debounce, getUrl } from '../utils';
import * as consts from '../../data/consts.json';
import Note from '../Note';
import VoteManagerTable from './VoteManagerTable';
import VoteManagerControls from './VoteManagerControls';
import VoteManagerIntro from './VoteManagerIntro';
import VoteManagerImportExport from './VoteManagerImportExport';
import VoteManagerSummary from './VoteManagerSummary';
import * as notes from '../../data/notes.json';

const toastText = 'Do you like this tool? vote alepop & 5an1ty!';

@observer
export default class VoteManager extends Component<any, any> {

  debouncedSearch: any;
  offsetTop: any;
  delegateCountRef:any;

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
      groupIsShown: null
    };
    this.debouncedSearch = debounce(this.search.bind(this), 400).bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.stickyCounter = this.stickyCounter.bind(this);
    this.getVoteUnvoteList = this.getVoteUnvoteList.bind(this);
    this.searchInPages = this.searchInPages.bind(this);
    this.setVoteManagerState = this.setVoteManagerState.bind(this);
    this.navigate = this.navigate.bind(this);
    this.setData = this.setData.bind(this);
    this.offsetTop = null;
  }

  componentDidMount() {
    this.offsetTop = this.delegateCountRef.offsetTop;
    document.addEventListener('scroll', this.stickyCounter);
    if (this.props.match.params.address) {
      this.getVotesForAddress(this.props.match.params.address).then(res => {
        this.navigate(1);
      }).catch(err => {
        console.log(`Fatal: ${err}`);
      });
    } else {
      this.navigate(1);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.stickyCounter);
  }

  setVoteManagerState(state, cb) {
    this.setState(state, cb);
  }

  setData(data, cb?) {
    const newData = data.map(d => {
      const newDelegate = { ...d };
      const dposFound = dposdata.find(dd => dd.delegate === newDelegate.username);
      newDelegate.percentage = dposFound ? dposFound.share : 0;
      newDelegate.groups = [];
      Object.keys(groups).forEach(ds => {
        if (groups[ds].tag) {
          const found = groups[ds].data.find(username => username === d.username);
          if (found) {
            newDelegate.groups.push({ group: ds, nobonus: groups[ds].nobonus, bonus: groups[ds].bonus });
          }
        }
      });
      return newDelegate;
    });
    this.props.store.setDelegates(newData);
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

  navigate(page, cb?) {
    this.getPage(page).then(data => {
      return this.setData(data, () => {
        this.setState({
          selectedPage: page,
          loaded: true,
          groupIsShown: null
        }, cb);
      });
    }).catch(res => {
      console.warn(res);
    });
  }

  updateSelectedSets() {
    let selectedSet = this.state.selectedSet;
    Object.keys(groups).forEach(set => {
      const foundVotes = this.state.selectedDelegates.reduce((acc, iv) => {
        if (groups[set].data.find(username => username === iv)) {
          acc.push(iv);
          return acc;
        } else {
          return acc;
        }
      }, []);
      if (foundVotes.length === groups[set].data.length) {
        selectedSet.push(set);
      } else {
        selectedSet = selectedSet.filter(entry => entry !== set);
      }
    });
    this.setState({ selectedSet });
  }

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
                </span>)) : null
          }
          { this.state.selectedDelegates.length <= consts.maxAllowedVotes ? <VoteManagerSummary getVoteUnvoteList={this.getVoteUnvoteList} enabled={data.length > 0} /> : `You cannot vote for more than ${consts.maxAllowedVotes} delegates, please reduce your selection.` }
        </div>
      </div>
    );
  }

  render() {
    const voteData = this.getVoteUnvoteList();
    return (
      <div>
        <VoteManagerIntro />
        <Toast text={toastText} timer={5000} />
        <Container>
          <div className="form-horizontal my-2">
            <div className="form-group" id="intro-starter">
              <div className="col-3 col-xs-6">
                <label className="form-label" htmlFor="input-search">Search for a delegate:</label>
              </div>
              <div className="col-9 col-xs-6">
                <input className="form-input" type="text" id="input-search" placeholder="Delegate" onKeyUp={this.handleSearch} />
              </div>
            </div>
            <div className="divider" />
            <VoteManagerControls
              data={this.state.data}
              selectedDelegates={this.state.selectedDelegates}
              selectedSet={this.state.selectedSet}
              groupIsShown={this.state.groupIsShown}
              selectedPage={this.state.selectedPage}
              initialVotes={this.state.initialVotes}
              navigate={this.navigate}
              updateSelectedSets={this.updateSelectedSets}
              setVoteManagerState={this.setVoteManagerState}
              searchInPages={this.searchInPages}
              setData={this.setData}
            />
            <div className="divider" />
            <VoteManagerImportExport
              initialVotes={this.state.initialVotes}
              selectedDelegates={this.state.selectedDelegates}
              getVoteUnvoteList={this.getVoteUnvoteList}
              setVoteManagerState={this.setVoteManagerState}
              updateSelectedSets={this.updateSelectedSets}
            />
            <div className="divider" />
            <p>When finished, send your changes to Lisk Nano by clicking the buttons below in sequence. You will get an overview of the votes you are sending in Nano before you actually submit the votes:</p>
            <div id="intro-vote-section">
              { this.renderVoteButtons(voteData) }
            </div>
            <div className="divider" />
            <div className={`text-center ${this.state.isSticky ? 'sticky' : ''}`} ref={el => { this.delegateCountRef = el; }}>
              <span className={`label label-${this.state.selectedDelegates.length > consts.maxAllowedVotes ? 'error' : 'primary'}`}>
                {this.state.selectedDelegates.length}/{consts.maxAllowedVotes} Votes
              </span>
            </div>
          </div>
        </Container>
        <Container withMargin>
          { !this.state.loaded ? <div className="loading" /> : null }
          <div className="table-wrapper">
            { this.state.loaded ? (
              <VoteManagerTable
                data={this.state.data}
                selectedDelegates={this.state.selectedDelegates}
                updateSelectedSets={this.updateSelectedSets}
                setVoteManagerState={this.setVoteManagerState}
              />
              ) : null }
          </div>
          <div className="centered">
            <ul className="pagination">
              <li className="page-item">
                <a className={`${this.state.selectedPage <= 1 ? 'disabled' : ''}`} href="#scroll" tabIndex={-1} onClick={() => this.navigate(this.state.selectedPage - 1)}>Previous</a>
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
                <a className={`${this.state.selectedPage >= this.state.totalPages ? 'disabled' : ''}`} href="#scroll" onClick={() => this.navigate(this.state.selectedPage + 1)}>Next</a>
              </li>
            </ul>
          </div>
        </Container>
        <Container withMargin>
          <Slack />
        </Container>
        <div className="bg-gray">
          <Container>
            <Note note={notes.note7} />
          </Container>
        </div>
      </div>
    );
  }
}
