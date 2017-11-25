import * as React from 'react';
import { Component } from 'react';
import Joyride from 'react-joyride';

export default class VoteManagerTable extends Component<any, any> {

  constructor(props) {
    super(props);
    let canUseLocalStorage = true;
    try {
      localStorage.getItem('localStorageTest');
    } catch (e) {
      canUseLocalStorage = false;
    }
    this.state = {
      canUseLocalStorage,
      introType: 'continuous',
      introSkipButton: true,
      introDisableOverlay: true,
      runIntro: canUseLocalStorage ? localStorage.getItem('voteManagerIntroDone') !== 'true' : false,
      introSteps: [
        {
          selector: '#intro-starter',
          text: 'Welcome to our vote manager tool, let\'s take a tour...'
        },
        {
          selector: '#input-search',
          text: 'You can search for a specific delegate here.'
        },
        {
          selector: '#intro-filters-block',
          text: 'These are toggles to select / deselect entire groups.'
        },
        {
          selector: '#intro-restore-btn',
          text: 'Restore the tool to your original votes.'
        },
        {
          selector: '#intro-unvote-btn',
          text: 'Unvote all delegates you currently vote for.'
        },
        {
          selector: '#intro-optimize-btn',
          text: 'Select a payment optimized set of delegates.'
        },
        {
          selector: '#intro-selectpage-btn',
          text: 'Select all delegates on the current page.'
        },
        {
          selector: '#intro-deselectpage-btn',
          text: 'Deselect all delegates on the current page.'
        },
        {
          selector: '#intro-import-btn',
          text: 'Import a comma seperated list of delegates to start from a template.'
        },
        {
          selector: '#intro-export-btn',
          text: 'Export a comma seperated list of delegates.'
        },
        {
          selector: '#intro-vote-btn',
          text: 'After making changes to your votes, you will see clickable buttons here to send your votes to Lisk Nano in batches of 33 changes / button.'
        },
        {
          selector: '#intro-summary-btn',
          text: 'See a summary of all the changes to your votes.'
        },
        {
          selector: '#intro-vote-section',
          text: 'Do not hesitate to click the vote buttons, Lisk Nano will ask you to confirm before sending the transaction.'
        }
      ]
    }
  }

  handleIntroChange(data) {
    if (data.type === 'finished') {
      window.scrollTo(0, 0);
      if (this.state.canUseLocalStorage) {
        localStorage.setItem('voteManagerIntroDone', 'true');
      }
    }
  }

  render() {
    return (
      <Joyride
        ref={() => 'joyride'}
        scrollOffset={54}
        type={this.state.introType}
        run={this.state.runIntro}
        autoStart={this.state.runIntro}
        showOverlay={true}
        showSkipButton={this.state.introSkipButton}
        disableOverlay={this.state.introDisableOverlay}
        steps={this.state.introSteps}
        callback={(p) => this.handleIntroChange(p)}
      />
    );
  }
}
