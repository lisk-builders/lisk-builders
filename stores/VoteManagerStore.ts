import { observable } from 'mobx';

class VoteManagerStore {
  @observable delegates = observable.array([]);

  setDelegates = (delegates) => {
    this.delegates.replace(delegates);
  }

}

const store = new VoteManagerStore();

export default store;
