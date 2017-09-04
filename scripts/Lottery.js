import React from 'react';
import axios from 'axios';
import classnames from 'classnames';
import lotteryData from '../data/lottery.json';

const modalClassnames = isActive =>
    classnames('modal', {
        active: isActive,
    });

const getLastWinnersData = lotteryData[lotteryData.length - 1];

class Lottery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            showModal: false,
            showWinnersModal: false,
            showStatsModal: false,
            lotteryResult: '',
            entries: []
        };
    }
    handleChange = event => {
        this.setState({
            address: event.target.value,
        });
    };
    closeModal = () => {
        this.setState({
            showModal: false,
        });
    };
    closeWinnersModal = () => {
        this.setState({
            showWinnersModal: false,
        });
    };
    closeStatsModal = () => {
        this.setState({
            showStatsModal: false,
        });
    };
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
                    lotteryResult: `You are entered in the lotery! You have also voted for ${relevantOptionalVotes.length} other members, this increases your tickets by ${relevantOptionalVotes.length * 5}%.`,
                });               
            } else {
                this.setState({
                    showModal: true,
                    lotteryResult: 'You are entered in the lotery!',
                });
            }
        } else {
            this.setState({
                showModal: true,
                lotteryResult:
                    'You have not voted for all delegates with the Required badge yet. Missing: ' +
                    missingVotes.join(', '),
            });
        }
    };
    checkEntered = () => {
        axios
            .get(
                `https://node08.lisk.io/api/accounts/delegates/?address=${this
                    .state.address}`,
            )
            .then(res => {
                if (res.data.success) {
                    this.showData(res.data);
                } else {
                    this.setState({
                        showModal: true,
                        lotteryResult: res.data.error,
                    });
                }
            });
    };

    showPreviousWinners = () => {
        this.setState({
            showWinnersModal: true,
        });
    };

    getDelegateData = delegate =>
    axios
        .get(`https://node08.lisk.io/api/delegates/get?username=${delegate.delegateName}`)
        .then(res => {
        return axios.get(`https://node08.lisk.io/api/delegates/voters?publicKey=${res.data.delegate.publicKey}`).then(res2 => {
            delegate.voters = res2.data.accounts ? res2.data.accounts : undefined;
            return delegate;
        });
        })
        .catch(res => delegate);

    showStats = () => {
        const { delegates } = this.props;
        const lotteryMembers = delegates.filter(dg => dg.required);
        const optionalMembers = delegates.filter(dg => !dg.required);
        const blacklist = lotteryMembers.map(dg => dg.delegateAddress);
        const candidates = {};

        axios.all(delegates.map(this.getDelegateData)).then(res => {
        res.forEach(dg => {
            dg.voters.forEach(vt => {
            if (blacklist.indexOf(vt.address) === -1) {
                if (dg.required) {
                if (!candidates[vt.address]) {
                    candidates[vt.address] = { required: 1, optional: 0 };
                } else {
                    candidates[vt.address].required += 1;
                }
                } else {
                if (!candidates[vt.address]) {
                    candidates[vt.address] = { required: 0, optional: 1 };
                } else {
                    candidates[vt.address].optional += 1;
                }
                }
            }
            });
        });
        const validCandidates = Object.keys(candidates).filter(key => candidates[key].required === lotteryMembers.length);
        Promise.all(
            validCandidates.map(vc => {
            return axios.get(`https://node02.lisk.io/api/accounts/getBalance?address=${vc}`).then(res2 => {
                const tickets = Math.floor(((res2.data.balance ? res2.data.balance : 0) / 100000000) * (1 + ((candidates[vc].optional * 5) / 100)));
                return { address: vc, required: candidates[vc].required, optional: candidates[vc].optional, tickets };
            });
            })
        )
            .then(res => {
                this.setState({
                    showStatsModal: true,
                    entries: res.filter(e => e.tickets > 0),
                });
            })
            .catch(err => console.log(err));
        });
    }

    render() {
        const { showModal, showWinnersModal, showStatsModal } = this.state;
        return (
            <div className="col-12 column">
                <div className={modalClassnames(showModal)}>
                    <div className="modal-overlay" />
                    <div className="modal-container col-xs-12 col-sm-12 col-md-12 col-5">
                        <div className="modal-header">
                            <button
                                className="btn btn-clear float-right"
                                onClick={this.closeModal}
                            />
                            <div className="modal-title">Lottery status</div>
                        </div>
                        <div className="modal-body">
                            <div className="content">
                                {this.state.lotteryResult}
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

                <div className={modalClassnames(showStatsModal)}>
                    <div className="modal-overlay" />
                    <div className="modal-container col-xs-12 col-sm-12 col-md-12 col-5">
                        <div className="modal-header">
                            <button
                                className="btn btn-clear float-right"
                                onClick={this.closeStatsModal}
                            />
                            <div className="modal-title">Lottery stats</div>
                        </div>
                        <div className="modal-body">
                            <div className="content">
                                <table className="table table-hover">
                                    <tbody>
                                        <tr>
                                            <td><strong>Total participants:</strong></td>
                                            <td>{this.state.entries.length}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Total tickets:</strong></td>
                                            <td>{this.state.entries.reduce((mem, val) => mem + val.tickets, 0)}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Ticket cap:</strong></td>
                                            <td>{Math.floor((this.state.entries.reduce((mem, val) => mem + val.tickets, 0) / this.state.entries.length) * 2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-primary"
                                onClick={this.closeStatsModal}>
                                OK
                            </button>
                        </div>
                    </div>
                </div>

                <div className={modalClassnames(showWinnersModal)}>
                    <div className="modal-overlay" />
                    <div className="modal-container col-xs-12 col-sm-12 col-md-12 col-5">
                        <div className="modal-header">
                            <button
                                className="btn btn-clear float-right"
                                onClick={this.closeWinnersModal}
                            />
                            <div className="modal-title">
                                Previous winners ({getLastWinnersData.date})
                            </div>
                        </div>
                        <div className="modal-body">
                            <div className="content">
                                Total Tickets:{' '}
                                <b>{getLastWinnersData.totalTickets}</b>
                                <br />
                                Average Tickets:{' '}
                                <b>{getLastWinnersData.averageTickets}</b>
                                <br />
                                Final Total Tickets:{' '}
                                <b>{getLastWinnersData.finalTotalTickets}</b>
                                <br />
                                Entries: <b>{getLastWinnersData.entries}</b>
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Address</th>
                                            <th>Tickets</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getLastWinnersData.winers.map(
                                            (el, i) =>
                                                <tr key={i}>
                                                    <td>
                                                        {' '}<a
                                                            target="_blank"
                                                            href={`https://explorer.lisk.io/address/${el.address}`}>
                                                            {el.address}
                                                        </a>
                                                    </td>
                                                    <td>
                                                        {el.tickets}
                                                    </td>
                                                    <td>
                                                        {el.amount}
                                                    </td>
                                                </tr>,
                                        )}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                        <div className="modal-footer">
                          <p className="text-left">
                                    If you would like to stay anonymous, send us
                                    a message and we will remove you from the
                                    winners page.
                                </p>
                            <button
                                className="btn btn-primary"
                                onClick={this.closeWinnersModal}>
                                OK
                            </button>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-title">Lottery</div>
                    </div>
                    <div className="panel-body">
                        <p>
                            Use <a href="https://github.com/LiskHQ/lisk-nano/releases/tag/v1.0.2" target="_blank">Lisk Nano</a> to Vote for all delegates with the{' '}
                            <label className="label label-primary">
                                Required
                            </label>{' '}
                            badge on the members list to be entered in a lottery.
                        </p>
                        <p>
                            Each participant gets 1 ticket per LSK they have in their Lisk account, capped to
                            twice the average LSK across all participants.
                        </p>
                        <p>
                            In addition if you vote for other members your tickets will be increased by <strong>5%</strong> with each vote.
                        </p>
                        <p>
                            The lottery winners are drawn at a <b>random point in time</b> during the month.<br/>
                            This means that removing your votes temporarily puts you at <b>risk of missing out</b>.
                        </p>
                        <p>
                            Payments happen on the last day of every month and
                            give out <strong>250 LSK</strong> to{' '}
                            <strong>20</strong> winners!
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={this.showPreviousWinners}>
                            Previous winners
                        </button>
                        <button
                            className="btn btn-primary btn-stats"
                            onClick={this.showStats}>
                            Lottery stats
                        </button>
                    </div>
                    <div className="panel-footer">
                        <div className="input-group">
                            <button
                                className="btn btn-primary input-group-btn"
                                disabled={!this.state.address}
                                onClick={this.checkEntered}>
                                Check if you are participating
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
        );
    }
}

export default Lottery;
