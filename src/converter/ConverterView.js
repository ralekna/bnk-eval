import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Card from 'material-ui/Card';
import LinearProgress from 'material-ui/LinearProgress';
import {List, ListItem} from 'material-ui/List';
import AppBar from 'material-ui/AppBar';
import PropTypes from 'prop-types';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import IconButton from 'material-ui/IconButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as R from 'ramda';

export default class ConverterView extends Component {

  static defaultProps = {
    rates: []
  };

  static propTypes = {
    rates: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string.isRequired,
      rate_float: PropTypes.number.isRequired
    })),
    onRefreshRequest: PropTypes.func
  };

  state = {
    amount: 0,
    hasAmountError: false,
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
    const amount = event.target.value;
    const hasAmountError = !/^\d*\.?\d*$/.test(amount.trim());
    this.setState(prevState => ({
      amount: hasAmountError ? prevState.amount : Number(amount),
      hasAmountError
    }));
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

  render() {
    return (
      <MuiThemeProvider>
        <Card style={{width:300}}>
          <AppBar
            showMenuIconButton={false}
            title="Calculator"
            iconElementRight={this.props.onRefreshRequest
              ? <IconButton
                onClick={this.props.onRefreshRequest}
                tooltip="Refresh rates"
                tooltipPosition="bottom-left">
                <NavigationRefresh />
              </IconButton>
              : null
            }
          />
          {this.state.rates.length === 0 && <LinearProgress mode="indeterminate" />}

          <div style={{padding: '16px'}}>
            <div>
              <TextField
                id="amountInput"
                floatingLabelText="Enter amount of BTC"
                hintText="0"
                onKeyUp={this.updateAmount.bind(this)}
                onChange={this.updateAmount.bind(this)}
                errorText={this.state.hasAmountError ? 'Please use only numbers and dot for decimal separator' : ''}
              />
            </div>
            {this.state.removedRates.length > 0 &&
            <SelectField
              onChange={this.handleCurrenciesSelectFieldChange.bind(this)}
              hintText="Add currency">
            {this.state.removedRates.map(rate =>
              <MenuItem key={rate.code} value={rate} primaryText={rate.code} />)}
            </SelectField>
            }
          </div>
          <List>
          {this.state.displayedRates.map(rate =>
            <ListItem
              key={rate.code}
              primaryText={rate.code}
              secondaryText={(rate.rate_float * this.state.amount).toFixed(2)}
              rightIconButton={
                <IconButton
                  tooltip="Remove from list"
                  tooltipPosition="bottom-left">
                  <ActionDelete
                    onClick={this.removeRateFromList.bind(this, rate)}
                    hoverColor="red"
                  />
                </IconButton>
              }
              disabled={true}

            />)}
          </List>
          <div style={{fontSize: '11px', padding: '16px'}}>
            {this.props.status !== undefined && <div style={{color: 'rgba(0, 0, 0, 0.54)'}}>{this.props.status}</div>}
            {this.props.error !== undefined && <div style={{color: 'rgba(255, 0, 0, 1)'}}>{this.props.error}</div>}
          </div>
        </Card>
      </MuiThemeProvider>
    );
  }
}
