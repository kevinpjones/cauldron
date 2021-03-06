import React from 'react';
import { mount } from 'enzyme';
import Checkbox from 'src/components/Checkbox';
import axe from '../../../axe';

const defaultProps = {
  id: 'boognish',
  name: 'boognish',
  value: 'boognish',
  label: 'Boognish'
};

test('handles checked prop', () => {
  const wrapper = mount(<Checkbox {...defaultProps} checked />);
  expect(
    wrapper.find('.Icon.Checkbox__overlay').hasClass('Icon--checkbox-checked')
  ).toBeTruthy();
  expect(
    wrapper.find('.Icon.Checkbox__overlay').hasClass('Icon--checkbox-unchecked')
  ).toBeFalsy();
  expect(wrapper.find('[type="checkbox"]').getDOMNode().checked).toBeTruthy();
});

test('handles checked prop changes', () => {
  const wrapper = mount(<Checkbox {...defaultProps} checked />);
  wrapper.setProps({
    checked: false
  });
  expect(wrapper.find('[type="checkbox"]').getDOMNode().checked).toBeFalsy();
});

test('toggles checked state properly', () => {
  const wrapper = mount(<Checkbox {...defaultProps} />);
  const checkbox = wrapper.find('[type="checkbox"]');
  expect(checkbox.getDOMNode().checked).toBeFalsy();
  expect(
    wrapper.find('.Icon.Checkbox__overlay').hasClass('Icon--checkbox-checked')
  ).toBeFalsy();

  checkbox.simulate('change');

  expect(checkbox.getDOMNode().checked).toBeTruthy();
  expect(
    wrapper.find('.Icon.Checkbox__overlay').hasClass('Icon--checkbox-checked')
  ).toBeTruthy();
});

test('clicks the checkbox when the overlay is clicked', () => {
  let clicked = false;
  const wrapper = mount(<Checkbox {...defaultProps} />);
  wrapper
    .find('[type="checkbox"]')
    .getDOMNode()
    .addEventListener('click', () => {
      clicked = true;
    });
  wrapper.find('Icon.Checkbox__overlay').simulate('click');
  expect(clicked).toBeTruthy();
});

test('handles disabled prop', () => {
  const wrapper = mount(<Checkbox {...defaultProps} disabled />);

  expect(wrapper.find('[type="checkbox"]').getDOMNode().disabled).toBeTruthy();
  expect(wrapper.find('.Field__label--disabled').exists()).toBeTruthy();
});

test('handles focus/blur', () => {
  const wrapper = mount(<Checkbox {...defaultProps} />);

  wrapper.find('[type="checkbox"]').simulate('focus');

  expect(wrapper.state('focused')).toBeTruthy();
  expect(wrapper.find('.Checkbox__overlay--focused').exists()).toBeTruthy();

  wrapper.find('[type="checkbox"]').simulate('blur');

  expect(wrapper.state('focused')).toBeFalsy();
  expect(wrapper.find('.Checkbox__overlay--focused').exists()).toBeFalsy();
});

test('call onChange when checked state changes', done => {
  const onChange = (e, checked) => {
    expect(checked).toBeTruthy();
    done();
  };

  const wrapper = mount(<Checkbox {...defaultProps} onChange={onChange} />);
  wrapper
    .find('[type="checkbox"]')
    .at(0)
    .simulate('change');
});

test('supports checkboxRef prop', done => {
  const ref = checkbox => {
    expect(checkbox instanceof HTMLElement).toBeTruthy();
    done();
  };

  mount(<Checkbox {...defaultProps} checkboxRef={ref} />);
});

test('should return no axe violations', async () => {
  const wrapper = mount(<Checkbox {...defaultProps} />);
  expect(await axe(wrapper.html())).toHaveNoViolations();
});

test('handles error prop', async () => {
  const wrapper = mount(<Checkbox {...defaultProps} error={'/giphy bears'} />);
  expect(await axe(wrapper.html())).toHaveNoViolations();
  const errorMessage = wrapper.find('.Error').getDOMNode();
  const input = wrapper.find('input').getDOMNode();
  expect(input.getAttribute('aria-describedby')).toBe(errorMessage.id);
});
