import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { createSandbox } from 'sinon';
import ConverterView from './ConverterView';

describe('<ConverterView />', () => {

  let sandbox;

  beforeEach(() => {
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('shows no currencies', () => {
    const wrapper = mount(<ConverterView rates={[]} />);
    expect(wrapper.find('ListItem')).to.have.length(0);
  });

  it('shows one currency', () => {
    const wrapper = mount(<ConverterView rates={[{"code": "USD", "rate_float": 8573.7675 }]}/>);
    expect(wrapper.find('ListItem')).to.have.length(1);
    expect(wrapper.find('ListItem').first().text()).to.contain('USD').and.to.contain('0.00');
  });

  it('converts to BTC amount to USD', () => {
    const updateSpy = sandbox.spy(ConverterView.prototype, 'updateAmount');
    const wrapper = mount(<ConverterView rates={[{"code": "USD", "rate_float": 8573.7675 }]}/>);

    const input = wrapper.find('#amountInput').first();

    input.props().onChange({ target: { value: '1'} });

    expect(updateSpy.calledOnce).to.be.true;
    expect(wrapper.find('ListItem')).to.have.length(1);
    expect(wrapper.state('removedRates')).to.have.lengthOf(0);
    expect(wrapper.state('displayedRates')).to.have.lengthOf(1);
    expect(wrapper.find('ListItem').first().text()).to.contain('USD').and.to.contain('8573.77'); // it's rounding to two digits after dot
  });

  it('shows error if amount is entered in wrong format', () => {
    const updateSpy = sandbox.spy(ConverterView.prototype, 'updateAmount');
    const wrapper = mount(<ConverterView rates={[{"code": "USD", "rate_float": 8573.7675 }]}/>);

    const input = wrapper.find('#amountInput').first();

    input.props().onChange({ target: { value: 'abc'} });

    expect(updateSpy.calledOnce).to.be.true;
    expect(wrapper.find('TextField').text()).to.contain('Please use only numbers and dot for decimal separator');
    expect(wrapper.find('ListItem').first().text()).to.contain('USD').and.to.contain('0.00');
  });

  it('removes currency from list', () => {
    const removeRateSpy = sandbox.spy(ConverterView.prototype, 'removeRateFromList');
    const wrapper = mount(<ConverterView rates={[{"code": "USD", "rate_float": 8573.7675 }]}/>);

    const deleteButton = wrapper.find('ActionDelete').first();

    deleteButton.props().onClick();

    expect(removeRateSpy.calledOnce).to.be.true;
    expect(wrapper.state('removedRates')).to.have.lengthOf(1);
    expect(wrapper.state('displayedRates')).to.have.lengthOf(0);

    wrapper.update();
    expect(wrapper.find('ListItem')).to.have.length(0);
  });

  it('adds currency back to list', () => {
    const removeRateSpy = sandbox.spy(ConverterView.prototype, 'removeRateFromList');

    const wrapper = mount(<ConverterView rates={[{"code": "USD", "rate_float": 8573.7675 }]}/>);

    const deleteButton = wrapper.find('ActionDelete').first();

    deleteButton.props().onClick();

    expect(removeRateSpy.calledOnce).to.be.true;
    expect(wrapper.state('removedRates')).to.have.lengthOf(1);
    expect(wrapper.state('displayedRates')).to.have.lengthOf(0);

    wrapper.update();
    expect(wrapper.find('ListItem')).to.have.length(0);

    const addRateSpy = sandbox.spy(ConverterView.prototype, 'addRateToList');

    wrapper.find('SelectField').first().props().onChange(undefined, undefined, {"code": "USD", "rate_float": 8573.7675 });

    expect(addRateSpy.calledOnce).to.be.true;

    expect(wrapper.state('removedRates')).to.have.lengthOf(0);
    expect(wrapper.state('displayedRates')).to.have.lengthOf(1);

    wrapper.update();
    expect(wrapper.find('ListItem')).to.have.length(1);

  });

  it('executes callback when refresh button is hit', () => {
    const refreshSpy = sandbox.spy();

    const wrapper = mount(<ConverterView rates={[]} onRefreshRequest={refreshSpy}/>);

    wrapper.find('AppBar').find('IconButton').props().onClick();

    expect(refreshSpy.calledOnce).to.be.true;
  });
});
