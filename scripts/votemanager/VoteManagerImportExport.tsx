import * as React from 'react';
import { Component } from 'react';

export default class VoteManagerModals extends Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      showExportModal: false,
      showImportModal: false,
      votesToImport: ''
    };
  }

  importVotes() {
    this.closeModal('import');
    this.props.store.setSelectedDelegates(this.state.votesToImport.replace(/ /g, '').split(','));
  }

  openModal(modal) {
    if (modal === 'export') {
      this.setState({ showExportModal: true });
    }
    if (modal === 'import') {
      this.setState({ showImportModal: true });
    }
  }

  closeModal(modal) {
    if (modal === 'export') {
      this.setState({ showExportModal: false });
    }
    if (modal === 'import') {
      this.setState({ showImportModal: false });
    }
  }

  render() {
    const voteData = this.props.store.voteUnvoteList;
    const flatVoteData = [].concat(...voteData);
    return (
      <div>
        <div className="btn-group btn-group-block">
          <button className="btn btn-secondary" id="intro-import-btn" onClick={() => this.openModal('import')}>Import Votes</button>
          <button className="btn btn-secondary" id="intro-export-btn" onClick={() => this.openModal('export')}>Export Votes</button>
        </div>
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
                  <textarea className="form-input" readOnly id="input-example-3" placeholder="Votes" rows={8} cols={50} value={this.props.store.selectedDelegates} />
                </div>
                <div className="form-group">
                  <a href={`mailto:?subject=Hey, Here's a list with great Lisk delegates you can vote for!&body=You can use the lisk.builders vote manager to easily manage your votes (https://lisk.builders/votemanager). Press the import button and paste this list: %0D%0A%0D%0A${this.props.selectedDelegates}`} className="btn btn-primary">Send via email</a>
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
                  <textarea className="form-input" id="input-example-3" placeholder="Votes" rows={8} cols={50} onChange={(e) => this.setState({ votesToImport: e.target.value })} />
                </div>
                <div className="form-group">
                  <button className="btn btn-secondary" onClick={() => this.importVotes()}>Import</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
