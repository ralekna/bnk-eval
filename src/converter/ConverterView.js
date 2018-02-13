import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
// import { string, object, array } from 'prop-types';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import * as R from 'ramda';

export default class ConverterView extends Component {

  static defaultProps = {
    rates: []
  };

  state = {
    amount: 0,
    rates: this.props.rates,
    removedRates: [],
    displayedRates: this.props.rates.concat()
  };

  componentWillReceiveProps(nextProps) {
    if(nextProps.rates !== this.props.rates) {
      // copying next rates to state
      this.setState(prevState => ({
        rates: nextProps.rates,
        ...nextProps.rates.reduce((store, rate) => {
          if (prevState.removedRates.length
            && prevState.removedRates.find(removedRate => removedRate.code === rate.code)) {
            store.removedRates.push(rate);
          } else {
            store.displayedRates.push(rate);
          }
          return store;
        }, {
          removedRates: [],
          displayedRates: []
        })
      }));
    }
  }

  removeRateFromList(rate) {
    this.setState(prevState => ({
      removedRates: R.append(rate, prevState.removedRates),
      displayedRates: R.reject(displayedRate => rate.code === displayedRate.code, prevState.displayedRates)
    }));
  }

  updateAmount(event) {
    this.setState({
      amount: event.target.value
    });
  }

  addRateToList(rate) {
    this.setState(prevState => ({
      removedRates: R.reject(removedRate => rate.code === removedRate.code, prevState.removedRates),
      displayedRates: R.append(rate, prevState.displayedRates),
    }));
  }

  handleCurrenciesSelectFieldChange(event, key, value) {
    this.addRateToList(value);
  }

  render () {
    return (
      <div>
        <div style={{padding: '20px 15px 16px 16px'}}>
          <div>
            <TextField id="amount" floatingLabelText="Enter amount of BTC" hintText="0" onKeyUp={this.updateAmount.bind(this)} />
          </div>
          {this.state.removedRates.length > 0 &&
          <SelectField onChange={this.handleCurrenciesSelectFieldChange.bind(this)} hintText="Add currency">
          {this.state.removedRates.map(rate =>
            <MenuItem key={rate.code} value={rate} primaryText={rate.code} />)}
          </SelectField>
          }
        </div>
        <List>
        {this.state.displayedRates.map(rate =>
          <ListItem key={rate.code} primaryText={rate.code} secondaryText={(rate.rate_float * this.state.amount).toFixed(2)} rightIcon={<ActionDelete onClick={this.removeRateFromList.bind(this, rate)} />} />)}
        </List>
      </div>
    );
  }
}
