import _ from 'lodash';
import React, { Component } from 'react';
import axios from 'axios';
import Container from './Container';
import Note from './Note';
import Panel from './Panel';
import poolData from '../data/pool.json';
import notes from '../data/notes.json';
import { fromRawLsk } from './utils';

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
    this.state = { forged: 0 };
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
  render() {
    const delegates = getPoolMembers(this.props.delegates).reverse();
    const activeDelegate = delegates.filter(delegate => delegate.rank <= 101);
    const progress = (100 * activeDelegate.length) / delegates.length;
    return (
      <div>
        <div className="bg-gray">
          <Container>
            <Note {...notes.note3} />
          </Container>
        </div>
        <Container>
          <PoolData forged={this.state.forged} progress={progress} />
          {_.map(delegates, Panel)}
        </Container>
        <Container>
          <Payouts />
        </Container>
      </div>
    );
  }
}
export default Pool;
