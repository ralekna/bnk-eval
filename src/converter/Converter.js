import React, { Component } from 'react';
import ConverterView from './ConverterView';

export default class Converter extends Component {

  constructor() {
    super();
    this.state = {
      rates: [],
      status: 'Loading...'
    };
  }

  componentWillMount() {
    this.fetchRates();
  }

  async fetchRates() {
    try {
      let result = await(await fetch('https://api.coindesk.com/v1/bpi/currentprice.json')).json();
      this.setState({
        rates: Object.values(result.bpi),
        status: `Rates updated on: ${result.time.updated}`,
        error: undefined
      });
    } catch (error) {
      this.setState({
        rates: [],
        status: undefined,
        error: 'Failed to load rates data'
      });
    }
  }

  render() {
    return (
      <ConverterView
        rates={this.state.rates}
        onRefreshRequest={this.fetchRates.bind(this)}
        status={this.state.status}
        error={this.state.error}
      />
    );
  }
}
