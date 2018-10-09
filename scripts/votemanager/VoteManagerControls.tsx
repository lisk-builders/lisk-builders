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
    this.state = {
      showWizardModal: false
    };
  }

  openModal(modal) {
    if (modal === 'wizard') {
      this.setState({ showWizardModal: true });
    }
  }

  closeModal(modal) {
    if (modal === 'wizard') {
      this.setState({ showWizardModal: false });
    }
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

  setSelectedToContrib() {
    const payoutcontrib  = _.uniq([...groups.gdt.data, ...groups.shw.data, ...groups.builders.data, ...groups.lig.data, ...groups.ascend.data, ...groups.dutchpool.data, "4fryn", "5an1ty", "acheng", "adrianhunter", "alepop", "anamix", "augurproject", "badman0316", "bioly", "bloqspace.io", "carbonara", "carolina", "cc001", "chamberlain", "communitypool", "corsaro", "crodam", "crolisk", "dakk", "devasive", "diamse", "eastwind_ja", "eclipsun", "elevate", "endro", "forger_of_lisk", "forrest", "gdtpool", "goldeneye", "gr33ndrag0n", "grajsondelegate", "grumlin", "hagie", "hirish", "hmachado", "honeybee", "iii.element.iii", "joel", "joo5ty", "kushed.delegate", "leo", "liberspirita", "liskascend", "liskgate", "liskit", "liskjp", "liskpoland.pl", "liskpool.top", "liskpool_com_01", "liskpro.com", "loveforever", "luiz", "luxiang7890", "minions", "moosty", "mrgr", "mrv", "nerigal", "nimbus", "ntelo", "ondin", "panzer", "philhellmuth", "phinx", "phoenix1969", "punkrock", "redsn0w", "robinhood", "samuray", "savetheworld", "seven", "sgdias", "shinekami", "slamper", "slasheks", "spacetrucker", "splatters", "stellardynamic", "tembo", "thepool", "tonyt908", "vekexasia", "vi1son", "vipertkd", "vrlc92", "ultrafresh", "moracle.network", "prolina"]);
    this.closeModal('wizard');
    this.props.store.setSelectedDelegates(payoutcontrib);
  }

  setSelectedToMaximum() {
    const payoutmax = _.uniq([...groups.gdt.data, ...groups.elite.data, ...groups.shw.data, 'thepool', 'liskpool_com_01', 'shinekami', 'vipertkd', 'vrlc92', 'communitypool', 'devasive', 'samuray', 'stellardynamic']).filter(e => ['4fryn', 'liskascend'].indexOf(e) === -1);
    this.closeModal('wizard');
    this.props.store.setSelectedDelegates(payoutmax);
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
          <button className="btn btn-secondary" id="intro-wizard-btn" onClick={() => this.openModal('wizard')}>Vote Wizard</button>
          <button className="btn btn-secondary" id="intro-selectpage-btn" onClick={() => this.selectCurrentPage()}>Select Current Page</button>
          <button className="btn btn-secondary" id="intro-deselectpage-btn" onClick={() => this.deselectCurrentPage()}>Deselect Current Page</button>
        </div>
        <div className={`modal ${this.state.showWizardModal ? 'active' : ''}`} id="modal-id">
          <a href="#close" className="modal-overlay" aria-label="Close"></a>
          <div className="modal-container">
            <div className="modal-header">
              <a href="#close" className="btn btn-clear float-right" aria-label="Close" onClick={() => this.closeModal('wizard')}></a>
              <div className="modal-title h5">Vote Wizard</div>
            </div>
            <div className="modal-body">
              <div className="content">
                <button className="btn btn-secondary btn-block" onClick={() => this.setSelectedToMaximum()}>Maximum Payout (100% Earnings)</button>
                <div className="divider text-center" data-content="OR"></div>
                <button className="btn btn-secondary btn-block" onClick={() => this.setSelectedToContrib()}>Support Contributors (71% Earnings)</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
