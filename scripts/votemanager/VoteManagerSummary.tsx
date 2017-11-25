import * as React from 'react';
import { Component } from 'react';

export default class VoteManagerSummary extends Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      showSummaryModal: false
    };
  }

  openModal(modal) {
    if (modal === 'summary') {
      this.setState({ showSummaryModal: true });
    }
  }

  closeModal(modal) {
    if (modal === 'summary') {
      this.setState({ showSummaryModal: false });
    }
  }

  render() {
    const voteData = this.props.store.voteUnvoteList;
    const flatVoteData = [].concat(...voteData);
    return (
      <span>
        <button className="btn btn-secondary" disabled={!this.props.enabled} id="intro-summary-btn" onClick={() => this.openModal('summary')}>Summary</button>
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
            <div className="modal-footer" />
          </div>
        </div>
      </span>
    );
  }
}
