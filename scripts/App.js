import _ from 'lodash';
import React, { Component } from 'react';
import Banner from './Banner';
import Note from './Note';
import Panel from './Panel';
import Container from './Container';
import notes from '../data/notes.json';
import axios from 'axios';

export default class App extends Component {
    state = {
        column: 'rank',
        data: this.props.data,
        direction: 'ascending',
    };

    handleSort = clickedColumn => () => {
        const { column, data, direction } = this.state;

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                data: _.sortBy(data, [clickedColumn]),
                direction: 'ascending',
            });

            return;
        }

        this.setState({
            data: data.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        });
    };

    checkEntered = () => {
        axios.get(`https://node08.lisk.io/api/accounts/delegates/?address=${this.input.value}`)
            .then(res => {
                const neededVotes = this.state.data.length;
                const relevantVotes = res.data.delegates.filter(delegate => this.state.data.filter((dg) => dg.delegateAddress === delegate.address).length > 0).length;
                if(relevantVotes === neededVotes) {
                    alert('OK');
                } else {
                    alert('NOK');
                }
            })
            .catch(res => alert('problem'));
    };

    render() {
        const { column, data, direction } = this.state;
        return (
            <div>
                <Banner />
                <div className="bg-gray">
                    <Container>
                        <Note {...notes.note1} />
                        <ul>
                            <li>First prize: 1500 LSK</li>
                            <li>Second prize: 900 LSK</li>
                            <li>Third prize: 600 LSK</li>
                        </ul>
                        <input type="text" ref={(input) => this.input = input}></input><button onClick={this.checkEntered}>Check if you are entered in the lottery</button>
                    </Container>
                </div>
                <Container>
                    {_.map(data, Panel)}
                </Container>
                <div className="bg-gray">
                    <Container>
                        <Note {...notes.note2} action="test" />
                    </Container>
                </div>
            </div>
        );
    }
}
