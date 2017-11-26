import * as _ from 'lodash';
import * as React from 'react';
import { Component } from 'react';
import { observer } from 'mobx-react';
import * as groups from '../../data/groups.json';
import { debounce, getUrl } from '../utils';

@observer
export default class VoteManagerControls extends Component<any, any> {

  constructor(props) {
    super(props);
  }

  showGroup(key) {
    if (this.props.store.shownGroup !== key) {
      this.props.searchInPages(groups[key].data)
        .then(res => {
          this.props.store.setDelegates(res);
          this.props.store.showGroup(key);
        })
        .catch(err => console.warn(err));
    } else {
      this.props.navigate(this.props.store.selectedPage);
    }
  }

  selectPreset(key) {
    const delegates = groups[key].data;
    this.props.store.toggleDelegates(delegates, key);
  }

  resetSelectedDelegates() {
    this.props.store.setSelectedDelegates(this.props.store.initialVotes);
  }

  wipeSelectedDelegates() {
    this.props.store.setSelectedDelegates([]);
  }

  selectCurrentPage() {
    this.props.store.setSelectedDelegates(_.uniq([...this.props.store.selectedDelegates,
      ...this.props.store.delegates.map(dg => dg.username)]));
  }

  deselectCurrentPage() {
    const filtered = this.props.store.selectedDelegates.filter(username =>
      !this.props.store.delegates.find(dg => dg.username === username));
    this.props.store.setSelectedDelegates(filtered);
  }

  setSelectedToOptimized() {
    const payoutoptimized = _.uniq([...groups.gdt.data, ...groups.elite.data, ...groups.shw.data, 'thepool', 'liskpool_com_01', 'liskpool.top', 'shinekami', 'vipertkd', 'vrlc92', 'communitypool', 'devasive', 'samuray', 'stellardynamic']);
    this.props.store.setSelectedDelegates(payoutoptimized);
  }

  renderFilters() {
    return Object.keys(groups).map(key => {
      const { fullname, tooltip } = groups[key];
      return (
        <div className="column col-4 col-xs-6" key={key}>
          <label className={`form-switch ${tooltip ? 'tooltip' : ''}`} data-tooltip={tooltip}>
            <input type="checkbox" checked={this.props.store.selectedSets.includes(key)} onChange={() => this.selectPreset(key)} />
            <i className="form-icon"></i> { fullname }
          </label>
          <button className="btn btn-link btn-sm" onClick={() => this.showGroup(key)}>{ this.props.store.shownGroup === key ? 'Hide' : 'Show' }</button>
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
