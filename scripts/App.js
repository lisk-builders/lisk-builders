import _ from 'lodash';
import React, { Component } from 'react';
import Banner from './Banner';
import Note from './Note';
import Panel from './Panel';
import Container from './Container';
import notes from '../data/notes.json';

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

    render() {
        const { column, data, direction } = this.state;
        return (
            <div>
                <Banner />
                <div className="bg-gray">
                    <Container>
                        <Note {...notes.note1} />
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
