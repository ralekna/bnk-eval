import React, { Component } from 'react';
import ConverterView from './ConverterView';
import CircularProgress from 'material-ui/CircularProgress';
import LinearProgress from 'material-ui/LinearProgress';
import Subheader from 'material-ui/Subheader';
import Card from 'material-ui/Card';

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
        loading: false,
        rates: Object.values(result.bpi)
      });

    } catch (error) {
      console.error('Failed to load data', error);
    }

  }

  render() {
    return (
      <Card style={{width:300}}>
        <Subheader>Crypto Currency Calculator</Subheader>
        { (this.state.loading)
          // ? <CircularProgress size={60} thickness={7} style={{left: '50%', marginLeft: -30}} />
          ? <LinearProgress mode="indeterminate" />
          : <ConverterView rates={this.state.rates}/> }
      </Card>
    );
  }
}
