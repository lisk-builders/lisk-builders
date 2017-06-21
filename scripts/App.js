import _ from 'lodash';
import React, { Component } from 'react';
import { Table, Label } from 'semantic-ui-react';

export default class App extends Component {

  state = {
    column: "rank",
    data: this.props.data,
    direction: "ascending",
  }

  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: 'ascending',
      })

      return
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    })
  }

  render() {
    const { column, data, direction } = this.state;

    return (
      <Table sortable celled collapsing>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell {...column === 'rank' ? {sorted: direction} : {}} onClick={this.handleSort('rank')}>
              Rank
            </Table.HeaderCell>
            <Table.HeaderCell {...column === 'delegateName' ? {sorted: direction} : {}} onClick={this.handleSort('delegateName')}>
              Delegate
            </Table.HeaderCell>
            <Table.HeaderCell {...column === 'delegateAddress' ? {sorted: direction}: {}} onClick={this.handleSort('delegateAddress')}>
              Delegate address
            </Table.HeaderCell>
            <Table.HeaderCell {...column === 'proposal' ? {sorted: direction} : {}} onClick={this.handleSort('proposal')}>
              Proposal
            </Table.HeaderCell>
            <Table.HeaderCell {...column === 'githubUsername' ? {sorted: direction} : {}} onClick={this.handleSort('githubUsername')}>
              GitHub username
            </Table.HeaderCell>
            <Table.HeaderCell {...column === 'poolPercentage' ? {sorted: direction} : {}} onClick={this.handleSort('poolPercentage')}>
              Pool %
            </Table.HeaderCell>
            <Table.HeaderCell {...column === 'affiliation' ? {sorted: direction} : {}} onClick={this.handleSort('affiliation')}>
              Affiliation
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(data, ({ rank, delegateName, delegateAddress, proposal, githubUsername, poolPercentage, affiliation }) => (
            <Table.Row key={delegateAddress}>
              <Table.Cell>{rank}</Table.Cell>
              <Table.Cell>{delegateName}</Table.Cell>
              <Table.Cell>{delegateAddress}</Table.Cell>
              <Table.Cell><a target="_blank" href={proposal}>Proposal</a></Table.Cell>
              <Table.Cell><a target="_blank" href={"https://github.com/" + githubUsername}>{githubUsername}</a></Table.Cell>
              <Table.Cell>{poolPercentage}%</Table.Cell>
              <Table.Cell>
                <Label color={affiliation === 'Freelance' ? 'green' : 'red'}>{affiliation}</Label>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}
