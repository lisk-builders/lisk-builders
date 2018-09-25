import * as _ from 'lodash';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import { Component } from 'react';
import { observer } from 'mobx-react';
import Slack from '../Slack';
import Container from '../Container';
import Toast from '../Toast';
import * as dposdata from '../../dpos-tools-data/lisk/pools.json';
import * as groups from '../../data/groups.json';
import { listDiff, debounce } from '../utils';
import * as consts from '../../data/consts.json';
import Note from '../Note';
import VoteManagerTable from './VoteManagerTable';
import VoteManagerControls from './VoteManagerControls';
import VoteManagerIntro from './VoteManagerIntro';
import VoteManagerImportExport from './VoteManagerImportExport';
import VoteManagerSummary from './VoteManagerSummary';
import * as notes from '../../data/notes.json';
import { client } from '../api';
import '@lisk-builders/lisk-buttons';

const toastText = 'Do you like this tool? Vote Lisk Builders!';

@observer
export default class VoteManager extends Component<any, any> {

  debouncedSearch: any;
  offsetTop: any;
  delegateCountRef:any;

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      isSticky: false
    };
    this.debouncedSearch = debounce(this.search.bind(this), 400).bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.stickyCounter = this.stickyCounter.bind(this);
    this.searchInPages = this.searchInPages.bind(this);
    this.navigate = this.navigate.bind(this);
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

  getVotesForAddress(address) {
    return client().votes.get({ address, limit: 101 }).then(res => {
      const { votes } = res.data;
      if (!!votes.length) {
        this.props.store.setInitialVotes(votes.map(dg => dg.username));
        this.props.store.setSelectedDelegates(this.props.store.initialVotes);
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

  search(qs) {
    if (qs) {
      client().delegates.get({ search: qs, sort: 'username:asc' })
        .then(res => {
          const delegates = res.data;
          if (!!delegates.length) {
            this.props.store.setDelegates(delegates);
            return true;
          } else {
            return false;
          }
        })
        .catch(res => {
          console.warn(res);
        });
    } else {
      this.navigate(this.props.store.selectedPage);
    }
  }

  handleSearch(event) {
    this.debouncedSearch(event.target.value);
  }

  async searchInPages(delegates) {
    let foundDelegates = [];
    for (let i = 1; i <= this.props.store.totalPages; i += 1) {
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
    const existingPage = this.props.store.pages.find(pg => pg.id === page);
    if (!existingPage) {
      return client().delegates.get({ limit: consts.maxAllowedVotes, offset: (page - 1) * consts.maxAllowedVotes})
      .then(async (res) => {
        const lastDelegate = await client().delegates.get({ limit: 1, sort: "rank:desc"});
        const totalPages = 1 + Math.floor((lastDelegate.data[0].rank - 1) / consts.maxAllowedVotes);
        this.props.store.addPage({ id: page, delegates: res.data })
        this.props.store.setTotalPages(totalPages);
        return res.data;
      });
    } else {
      return Promise.resolve(existingPage.delegates);
    }
  }

  navigate(page, cb?) {
    this.getPage(page).then(data => {
      this.props.store.setDelegates(data);
      this.props.store.showGroup(null);
      this.props.store.setPage(page);
      this.setState({
        loaded: true
      }, cb);
    }).catch(res => {
      console.warn(res);
    });
  }

  renderVoteButtons = (data) => {
    const getNames = (groups) =>
      groups.map(el => el.name).join(',');
    return (
      <div>
        <div className="tooltip" data-tooltip={`${consts.votingFee} LSK transaction fee per batch of ${consts.maxVotesInOneBatch} votes`}>
          { !data.length && (<button style={{ marginRight: 4 }} className="btn btn-secondary" disabled id="intro-vote-btn">Step 1: -0, +0</button>) }
          {
            this.props.store.selectedDelegates.length <= consts.maxAllowedVotes ? data.map(votes => _.groupBy(votes, 'type'))
              .map((group, i) => (
                <span style={{ marginRight: 4 }} key={i}>
                  <lisk-button-vote
                    votes={group.vote ? getNames(group.vote) : ''} unvotes={group.unvote ? getNames(group.unvote) : ''}
                    title={`Step ${i + 1}: ${group.unvote ? `-${group.unvote.length}` : ''}${group.vote && group.unvote ? `, +${group.vote.length}` : ''}${group.vote && !group.unvote ? `+${group.vote.length}` : ''}`}
                  />
                </span>)) : null
          }
          { this.props.store.selectedDelegates.length <= consts.maxAllowedVotes ? <VoteManagerSummary store={this.props.store} enabled={data.length > 0} /> : `You cannot vote for more than ${consts.maxAllowedVotes} delegates, please reduce your selection.` }
        </div>
      </div>
    );
  }

  render() {
    const voteData = this.props.store.voteUnvoteList;
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
              store={this.props.store}
              navigate={this.navigate}
              searchInPages={this.searchInPages}
            />
            <div className="divider" />
            <VoteManagerImportExport
              store={this.props.store}
            />
            <div className="divider" />
            <p>When finished, send your changes to Lisk Nano by clicking the buttons below in sequence. You will get an overview of the votes you are sending in Nano before you actually submit the votes:</p>
            <div id="intro-vote-section">
              { this.renderVoteButtons(voteData) }
            </div>
            <div className="divider" />
            <div className={`text-center ${this.state.isSticky ? 'sticky' : ''}`} ref={el => { this.delegateCountRef = el; }}>
              <span className={`label label-${this.props.store.selectedDelegates.length > consts.maxAllowedVotes ? 'error' : 'primary'}`}>
                {this.props.store.selectedDelegates.length}/{consts.maxAllowedVotes} Votes
              </span>
            </div>
          </div>
        </Container>
        <Container withMargin>
          { !this.state.loaded ? <div className="loading" /> : null }
          <div className="table-wrapper">
            { this.state.loaded ? (
              <VoteManagerTable store={this.props.store} />
              ) : null }
          </div>
          <div className="centered">
            <ul className="pagination">
              <li className="page-item">
                <a className={`${this.props.store.selectedPage <= 1 ? 'disabled' : ''}`} href="#scroll" tabIndex={-1} onClick={() => this.navigate(this.props.store.selectedPage - 1)}>Previous</a>
              </li>
              { this.props.store.selectedPage - 1 > 0 &&
                <li className="page-item">
                  <a href="#scroll" onClick={() => this.navigate(this.props.store.selectedPage - 1)}>{ this.props.store.selectedPage - 1 }</a>
                </li>
              }
              <li className="page-item active">
                <a href="#scroll" onClick={() => this.navigate(this.props.store.selectedPage)}>{ this.props.store.selectedPage }</a>
              </li>
              { this.props.store.selectedPage + 1 <= this.props.store.totalPages &&
                <li className="page-item">
                  <a href="#scroll" onClick={() => this.navigate(this.props.store.selectedPage + 1)}>{ this.props.store.selectedPage + 1 }</a>
                </li>
              }
              <li className="page-item">
                <span>...</span>
              </li>
              <li className="page-item">
                <a href="#scroll" onClick={() => this.navigate(this.props.store.totalPages)}>{this.props.store.totalPages}</a>
              </li>
              <li className="page-item">
                <a className={`${this.props.store.selectedPage >= this.props.store.totalPages ? 'disabled' : ''}`} href="#scroll" onClick={() => this.navigate(this.props.store.selectedPage + 1)}>Next</a>
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
