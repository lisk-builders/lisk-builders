import _ from 'lodash';
import React, { Component } from 'react';
import { Table, Label } from 'semantic-ui-react';
import Banner from './Banner';
import Note from './Note';
import Panel from './Panel';

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
                <div className="container grid-960">
                    <Note />
                    <div className="columns">
                        {_.map(data, Panel)}
                    </div>
                </div>
            </div>
        );
    }
}
