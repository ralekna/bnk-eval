import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class CryptoCurrencyConverter extends Component {
  render () {
    return (
      <div>
        <TextField floatingLabelText="Amount" />
        <SelectField>
          <MenuItem value="penis" primaryText="Penis"></MenuItem>
        </SelectField>
      </div>
    );
  }
}
