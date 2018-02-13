import React, { Component } from 'react';
import ConverterView from './ConverterView';

export default class Converter extends Component {

  constructor () {
    super();
    this.state = { loading: true };

  }

  componentWillMount() {
    this.fetchRates();
  }

  async fetchRates() {
    try {
      let result = await(await fetch('https://api.coindesk.com/v1/bpi/currentprice.json')).json();
      console.log(result);
      this.setState({
        loading: true,
        rates: Object.values(result.bpi)
      });

    } catch (error) {
      console.error('Failed to load data', error);
    }

  }

  render() {
    return (
      <ConverterView rates={this.state.rates} onRefreshRequest={this.fetchRates.bind(this)}/>
    );
  }
}
