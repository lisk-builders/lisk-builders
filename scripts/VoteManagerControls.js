import React, { Component } from 'react';
import groups from '../data/groups.json';
import { listDiff, debounce, getUrl } from './utils';

const delegateSet = {
  builders: groups.builders.data,
  gdt: groups.gdt.data,
  elite: groups.elite.data,
  sherwood: groups.shw.data,
  dutchpool: groups.dutchpool.data,
  alepop5an1ty: ['alepop', '5an1ty'],
  payoutoptimized: _.uniq([...groups.gdt.data, ...groups.elite.data, ...groups.shw.data, 'thepool', 'liskpool_com_01', 'liskpool.top', 'shinekami', 'vipertkd', 'vrlc92', 'communitypool', 'devasive', 'samuray', 'phoenix1969', 'stellardynamic']) // 'bitbanksy', 'stellardynamic'
};

export default class VoteManagerControls extends Component {

  constructor(props) {
    super(props);
  }

  static getFilterData() {
    return [
      { title: 'Lisk Builders', set: 'builders', tooltip: 'Active contributors to lisk' },
      { title: 'GDT', set: 'gdt', tooltip: 'https://pool.liskgdt.net' },
      { title: 'Elite', set: 'elite', tooltip: 'https://liskelite.com' },
      { title: 'Sherwood', set: 'sherwood', tooltip: 'http://robinhood.liskpro.com' },
      { title: 'alepop & 5an1ty', set: 'alepop5an1ty', tooltip: 'The creators of this site ;-)' },
      { title: 'Dutch Pool', set: 'dutchpool', tooltip: 'http://lisk.dutchpool.io/' }
    ];
  }

  showGroup(key) {
    if (this.props.groupIsShown !== key) {
      this.props.searchInPages(delegateSet[key])
      //Promise.all(delegateSet[key].map(username => axios.get(`${getUrl()}/api/delegates/get?username=${username}`)))
      .then(res => this.props.setData(res, () => this.props.setVoteManagerState({ groupIsShown: key })))
      .catch(err => console.warn(err));
    } else {
      this.props.navigate(this.props.selectedPage);
    }
  }

  selectPreset(key) {
    const delegates = delegateSet[key];
    this.props.setVoteManagerState(
      { selectedSet: this.props.selectedSet.includes(key) ?
        this.props.selectedSet.filter(el => el !== key) :
        [...this.props.selectedSet, key]
      }, this.toggleDelegates.bind(this, delegates, key));
  }

  toggleDelegates(delegateUsernames, key) {
    const delegateDiff = this.getDelegatesDiff(delegateUsernames, key);
    const currentSelectedDelegates = [...this.props.selectedDelegates];
    const delegates = delegateDiff.length > 0 ? delegateDiff : delegateUsernames;
    if (this.props.selectedSet.indexOf(key) === -1) {
      this.props.setVoteManagerState({
        selectedDelegates: currentSelectedDelegates.filter(el => delegates.indexOf(el) === -1)
      }, this.props.updateSelectedSets);
    } else {
      this.props.setVoteManagerState({
        selectedDelegates: _.uniq([...currentSelectedDelegates, ...delegates])
      }, this.props.updateSelectedSets);
    }
  }

  getDelegatesDiff(delegateUsernames, key) {
    const selectedGroups = this.props.selectedSet
      .filter(k => k !== key)
      .map(k => delegateSet[k])
      .reduce((acc, group) => listDiff(acc, group), delegateUsernames);
    return selectedGroups;
  }

  resetSelectedDelegates() {
    this.props.setVoteManagerState({ selectedDelegates: this.props.initialVotes }, this.props.updateSelectedSets);
  }

  wipeSelectedDelegates() {
    this.props.setVoteManagerState({ selectedDelegates: [] }, this.props.updateSelectedSets);
  }

  selectCurrentPage() {
    this.props.setVoteManagerState({ selectedDelegates: _.uniq([...this.props.selectedDelegates,
      ...this.props.data.map(dg => dg.username)]) }, this.props.updateSelectedSets);
  }

  deselectCurrentPage() {
    const filtered = this.props.selectedDelegates.filter(username =>
      !this.props.data.find(dg => dg.username === username));
    this.props.setVoteManagerState({ selectedDelegates: filtered }, this.props.updateSelectedSets);
  }

  setSelectedToOptimized() {
    this.props.setVoteManagerState({ selectedDelegates: delegateSet.payoutoptimized }, this.props.updateSelectedSets);
  }

  renderFilters() {
    return VoteManagerControls.getFilterData().map(({ title, set, tooltip }, i) => (
      <div className="column col-4 col-xs-6" key={i}>
        <label className={`form-switch ${tooltip ? 'tooltip' : ''}`} data-tooltip={tooltip}>
          <input type="checkbox" checked={this.props.selectedSet.includes(set)} onChange={() => this.selectPreset(set)} />
          <i className="form-icon"></i> { title }
        </label>
        <button className="btn btn-link btn-sm" onClick={() => this.showGroup(set)}>{ this.props.groupIsShown === set ? 'Hide' : 'Show' }</button>
      </div>
    ));
  };

  render() {
    return (
      <div>
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
      </div>
    );
  }
}
