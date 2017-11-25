import * as _ from 'lodash';
import * as React from 'react';
import { Component } from 'react';
import * as groups from '../../data/groups.json';
import { listDiff, debounce, getUrl } from '../utils';

export default class VoteManagerControls extends Component<any, any> {

  constructor(props) {
    super(props);
  }

  showGroup(key) {
    if (this.props.groupIsShown !== key) {
      this.props.searchInPages(groups[key].data)
      .then(res => this.props.setData(res, () => this.props.setVoteManagerState({ groupIsShown: key })))
      .catch(err => console.warn(err));
    } else {
      this.props.navigate(this.props.selectedPage);
    }
  }

  selectPreset(key) {
    const delegates = groups[key].data;
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
    const selectedGroups = groups[key].data
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
    const payoutoptimized = _.uniq([...groups.gdt.data, ...groups.elite.data, ...groups.shw.data, 'thepool', 'liskpool_com_01', 'liskpool.top', 'shinekami', 'vipertkd', 'vrlc92', 'communitypool', 'devasive', 'samuray', 'stellardynamic']);
    this.props.setVoteManagerState({ selectedDelegates: payoutoptimized }, this.props.updateSelectedSets);
  }

  renderFilters() {
    return Object.keys(groups).map(key => {
      const { fullname, tooltip } = groups[key];
      return (
        <div className="column col-4 col-xs-6" key={key}>
          <label className={`form-switch ${tooltip ? 'tooltip' : ''}`} data-tooltip={tooltip}>
            <input type="checkbox" checked={this.props.selectedSet.includes(key)} onChange={() => this.selectPreset(key)} />
            <i className="form-icon"></i> { fullname }
          </label>
          <button className="btn btn-link btn-sm" onClick={() => this.showGroup(key)}>{ this.props.groupIsShown === key ? 'Hide' : 'Show' }</button>
        </div>
      );
    });
  }

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
