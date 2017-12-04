import { observable, computed } from 'mobx';
import * as _ from 'lodash';
import { listDiff } from '../scripts/utils';
import * as dposdata from '../dpos-tools-data/lisk/pools.json';
import * as groups from '../data/groups.json';

const getDelegatesDiff = function(delegateUsernames, key) {
  const selectedGroups = groups[key].data
    .reduce((acc, group) => listDiff(acc, group), delegateUsernames);
  return selectedGroups;
};

class VoteManagerStore {

  @observable delegates = observable.array([]);
  @observable initialVotes = observable.array([]);
  @observable selectedDelegates = observable.array([]);
  @observable shownGroup = null;
  @observable pages = observable.array([]);
  @observable selectedPage = 1;
  @observable totalPages = 1;

  @computed get selectedSets() {
    let selectedSets = [];
    Object.keys(groups).forEach(set => {
      const foundVotes = this.selectedDelegates.reduce((acc, iv) => {
        if (groups[set].data.find(username => username === iv)) {
          acc.push(iv);
        }
        return acc;
      }, []);
      if (foundVotes.length === groups[set].data.length) {
        selectedSets.push(set);
      } else {
        selectedSets = selectedSets.filter(entry => entry !== set);
      }
    });
    return selectedSets;
  }

  @computed get voteUnvoteList() {
    const { initialVotes, selectedDelegates } = this;
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

  setDelegates = (delegates) => {
    const newData = delegates.map(d => {
      const newDelegate = { ...d };
      const dposFound = dposdata.find(dd => {
        const usernameFound = dd.delegate === newDelegate.username;
        const eliteFound = dd.requirements && dd.requirements.find(r => r.value === 'elite');
        return usernameFound && !eliteFound;
      });
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
    this.delegates.replace(newData);
  }

  setInitialVotes = (initialVotes) => {
    this.initialVotes.replace(initialVotes);
  }

  setSelectedDelegates = (delegates) => {
    this.selectedDelegates.replace(delegates);
  }

  toggleDelegate = (delegate) => {
    let selectedDelegates = [...this.selectedDelegates];
    if (selectedDelegates.find(username => username === delegate.username)) {
      selectedDelegates = selectedDelegates.filter(dg =>
        dg !== delegate.username
      );
    } else {
      selectedDelegates.push(delegate.username);
    }
    this.selectedDelegates.replace(selectedDelegates);
  }

  toggleDelegates = (delegateUsernames, key) => {
    const delegateDiff = getDelegatesDiff(delegateUsernames, key);
    const currentSelectedDelegates = [...this.selectedDelegates];
    const delegates = delegateDiff.length > 0 ? delegateDiff : delegateUsernames;
    if (this.selectedSets.indexOf(key) > -1) {
      this.setSelectedDelegates(currentSelectedDelegates.filter(el => delegates.indexOf(el) === -1));
    } else {
      this.setSelectedDelegates(_.uniq([...currentSelectedDelegates, ...delegates]));
    }
  }

  showGroup = (key) => {
    this.shownGroup = key;
  }

  addPage = (page) => {
    this.pages.push(page);
  }

  setPage = (num) => {
    this.selectedPage = num;
  }

  setTotalPages = (num) => {
    this.totalPages = num;
  }

}

const store = window["store"] = new VoteManagerStore();

export default store;
