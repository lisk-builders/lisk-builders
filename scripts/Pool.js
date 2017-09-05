import _ from 'lodash';
import React, { Component } from 'react';
import axios from 'axios';
import classnames from 'classnames';
import Container from './Container';
import Note from './Note';
import Panel from './Panel';
import Slack from './Slack';
import poolData from '../data/pool.json';
import notes from '../data/notes.json';
import { fromRawLsk } from './utils';

const modalClassnames = isActive =>
  classnames('modal', {
    active: isActive,
  });

const getForgedLisk = ({ publicKey }) =>
  axios.get(`https://node01.lisk.io/api/delegates/forging/getForgedByAccount?generatorPublicKey=${publicKey}&start=${poolData.updateTimestamp}`)
    .then(res => res.data);
const getPoolMembers = data => _.filter(data, 'poolMember');

const PoolData = props => (
  <div className="column col-12">
    <div className="panel">
      <div className="panel-header text-center">
        <div className="panel-title">Forged since last payout: <b>{props.forged} LSK</b></div>
        <div className="panel-subtitle">{ new Date(poolData.updateTimestamp * 1000).toUTCString()}</div>
      </div>
      <div className="panel-body" />
    </div>
  </div>
);

const Payouts = () => (
  <div className="column col-12">
    <div className="panel">
      <div className="panel-header text-center">
        <div className="panel-title"> Pool payouts </div>
        <div className="panel-subtitle">{ new Date(poolData.updateTimestamp * 1000).toUTCString()}</div>
      </div>
      <div className="panel-body">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Address</th>
              <th>Paid Balance</th>
              <th>Unpaid Balance</th>
            </tr>
          </thead>
          <tbody>
            { _.orderBy(poolData.accounts, ['paidBalance'], ['desc']).map((data, i) => (
              <tr key={i}>
                <td>{ data.address }</td>
                <td>{ fromRawLsk(data.paidBalance)}</td>
                <td>{ fromRawLsk(data.unpaidBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

class Pool extends Component {
  constructor(props) {
    super(props);
    this.getTotalForgedLisk = this.getTotalForgedLisk.bind(this);
    this.state = { forged: 0, address: '', showModal: false, poolResult: '' };
  }
  componentDidMount() {
    const poolMembers = getPoolMembers(this.props.delegates);
    axios.all([...poolMembers.map(getForgedLisk)])
      .then(this.getTotalForgedLisk)
      .catch(() => this.getTotalForgedLisk([]));
  }
  getTotalForgedLisk(data) {
    const totalForged = data.reduce((acc, el) => acc + fromRawLsk(el.forged), 0);
    this.setState({
      forged: parseInt((totalForged * 30) / 100, 10)
    });
  }
  handleChange = event => {
    this.setState({
      address: event.target.value,
    });
  }
  showData = data => {
      const { delegates } = this.props;
      const neededVotes = delegates.filter(dg => dg.required);
      const optionalVotes = delegates.filter(dg => !dg.required);
      const relevantVotes = neededVotes.filter(
          delegate =>
              data.delegates.filter(
                  dg => dg.address === delegate.delegateAddress,
              ).length > 0,
      );
      const relevantOptionalVotes = optionalVotes.filter(
          delegate =>
              data.delegates.filter(
                  dg => dg.address === delegate.delegateAddress,
              ).length > 0,
      );
      const missingVotes = neededVotes
          .filter(
              delegate =>
                  relevantVotes.filter(
                      dg => dg.delegateAddress === delegate.delegateAddress,
                  ).length === 0,
          )
          .map(delegate => delegate.delegateName);
      if (relevantVotes.length === neededVotes.length) {
          if (relevantOptionalVotes.length > 0) {
                this.setState({
                  showModal: true,
                  poolResult: `You are all set! You have also voted for ${relevantOptionalVotes.length} other members, this virtually increases your voting weight by ${relevantOptionalVotes.length * 5}%.`,
              });
          } else {
              this.setState({
                  showModal: true,
                  poolResult: 'You are all set!',
              });
          }
      } else {
          this.setState({
              showModal: true,
              poolResult:
                  'You have not voted for all delegates with the Required badge yet. Missing: ' +
                  missingVotes.join(', '),
          });
      }
  }
  checkEntered = () => {
    return axios.get(`https://node08.lisk.io/api/accounts/delegates/?address=${this.state.address}`).then(res => {
      if (res.data.success) {
        this.showData(res.data);
      } else {
        this.setState({
          showModal: true,
          poolResult: res.data.error,
        });
      }
      return true;
    });
  }
  closeModal = () => {
    this.setState({
      showModal: false,
    });
  }
  render() {
    const delegates = getPoolMembers(this.props.delegates).reverse();
    const activeDelegate = delegates.filter(delegate => delegate.rank <= 101);
    const progress = (100 * activeDelegate.length) / delegates.length;
    return (
      <div>
        <div className={modalClassnames(this.state.showModal)}>
            <div className="modal-overlay" />
            <div className="modal-container col-xs-12 col-sm-12 col-md-12 col-5">
                <div className="modal-header">
                    <button
                        className="btn btn-clear float-right"
                        onClick={this.closeModal}
                    />
                    <div className="modal-title">Pool status</div>
                </div>
                <div className="modal-body">
                    <div className="content">
                        {this.state.poolResult}
                    </div>
                </div>
                <div className="modal-footer">
                    <button
                        className="btn btn-primary"
                        onClick={this.closeModal}>
                        OK
                    </button>
                </div>
            </div>
        </div>
        <div className="bg-gray">
          <Container>
            <Note {...notes.note3} />
          </Container>
        </div>
        <Container>
          <div className="column col-12">
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">Pool Checklist</div>
              </div>
              <div className="panel-body">
                <p>
                  Make sure you are voting for all <label className="label label-primary">Required</label> members to receive your reward.
                </p>
                <p>
                  In addition if you vote for other members your voting weight will be virtually increased by <strong>5%</strong> with each vote.<br/>
                  For instance: if you vote for 8 additional delegates on top the required delegates, your voting weight will be virtually increased by 40%.
                </p>
                <p>
                  However if everyone votes the same way as you, you will not notice any increase in your payout.
                </p>
              </div>
              <div className="panel-footer">
                  <div className="input-group">
                      <button
                          className="btn btn-primary input-group-btn"
                          disabled={!this.state.address}
                          onClick={this.checkEntered}>
                          Check if you are entered
                      </button>
                      <input
                          value={this.state.address}
                          onChange={this.handleChange}
                          type="text"
                          className="form-input"
                          placeholder="type your LSK address"
                      />
                  </div>
              </div>
            </div>
          </div>
        </Container>
        <Container>
          <PoolData forged={this.state.forged} progress={progress} />
          {_.map(delegates, Panel)}
        </Container>
        <Container>
          <Slack />
        </Container>
        <Container>
          <Payouts />
        </Container>
      </div>
    );
  }
}
export default Pool;
