import React from 'react';
import axios from 'axios';
import classnames from 'classnames';

const modalClassnames = isActive =>
    classnames('modal', {
        active: isActive,
    });

class Lottery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            showModal: false,
            lotteryResult: '',
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
    showData = data => {
        const { delegates } = this.props;
        const neededVotes = delegates.filter(
            dg => dg.affiliation === 'Freelance',
        ).length;
        const relevantVotes = data.delegates.filter(
            delegate =>
                delegates.filter(dg => dg.delegateAddress === delegate.address)
                    .length > 0,
        ).length;
        if (relevantVotes === neededVotes) {
            this.setState({
                showModal: true,
                lotteryResult: 'OK',
            });
        } else {
            this.setState({
                showModal: true,
                lotteryResult: 'NOK',
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
    render() {
        const { showModal } = this.state;
        return (
            <div className="col-12 column">

                <div className={modalClassnames(showModal)}>
                    <div className="modal-overlay" />
                    <div className="modal-container col-4">
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

                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-title">Lottery</div>
                    </div>
                    <div className="panel-body">
                        Vote for all members with the tag <mark>Freelance</mark>{' '}
                        on this list to be entered in a lottery. The lottery
                        draws every month and gives out:
                        <ul>
                            <li>First prize: <strong>1500 LSK</strong></li>
                            <li>Second prize: <strong>900 LSK</strong></li>
                            <li>Third prize: <strong>600 LSK</strong></li>
                        </ul>
                    </div>
                    <div className="panel-footer">
                        <div className="input-group">
                            <button
                                className="btn btn-primary input-group-btn"
                                disabled={!this.state.address}
                                onClick={this.checkEntered}>
                                Check if you are entered in the lottery
                            </button>
                            <input
                                value={this.state.address}
                                onChange={this.handleChange}
                                type="text"
                                className="form-input"
                                placeholder="type your LSK adrress"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Lottery;
