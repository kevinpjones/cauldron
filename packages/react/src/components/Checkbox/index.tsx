import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import nextId from 'react-id-generator';
import setRef from '../../utils/setRef';
import Icon from '../Icon';
import tokenList from '../../utils/token-list';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  id: string;
  name?: string;
  label: React.ReactNode;
  error?: React.ReactNode;
  value?: string;
  checked?: boolean;
  onChange: (e: React.FormEvent<HTMLInputElement>, checked: boolean) => void;
  checkboxRef: React.Ref<HTMLInputElement>;
}

interface CheckboxState {
  checked: boolean;
  focused: boolean;
}

export default class Checkbox extends React.Component<
  CheckboxProps,
  CheckboxState
> {
  private checkbox: HTMLInputElement | null;

  static defaultProps = {
    error: null,
    checked: false,
    disabled: false,
    onChange: () => {},
    checkboxRef: () => {}
  };

  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    label: PropTypes.node.isRequired,
    error: PropTypes.node,
    value: PropTypes.string,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    onChange: PropTypes.func,
    checkboxRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.any })
    ])
  };

  static displayName = 'Checkbox';

  private errorId = nextId();

  constructor(props: CheckboxProps) {
    super(props);
    this.state = { checked: !!this.props.checked, focused: false };
    this.toggleFocus = this.toggleFocus.bind(this);
    this.onCheckboxClick = this.onCheckboxClick.bind(this);
    this.onOverlayClick = this.onOverlayClick.bind(this);
  }

  componentDidUpdate(prevProps: CheckboxProps) {
    const { checked } = this.props;

    if (checked !== prevProps.checked) {
      this.setState({ checked: !!checked });
    }
  }

  toggleFocus() {
    this.setState({ focused: !this.state.focused });
  }

  onCheckboxClick(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = !this.state.checked;
    this.setState({ checked });
    this.props.onChange(e, checked);
  }

  onOverlayClick() {
    this.checkbox?.click();
    this.checkbox?.focus();
  }

  render() {
    const { checked, focused } = this.state;
    // disabling no-unused-vars below to prevent specific
    // props from being passed through to the wrapper
    const {
      id,
      value,
      name,
      label,
      disabled,
      className,
      // eslint-disable-next-line no-unused-vars
      onChange,
      checked: notUsed,
      // eslint-disable-next-line no-unused-vars
      checkboxRef,
      error,
      'aria-describedby': ariaDescribedby,
      ...others
    } = this.props;

    const checkboxProps = {
      'aria-describedby': error
        ? tokenList(this.errorId, ariaDescribedby)
        : ariaDescribedby
    };

    return (
      <>
        <div
          className={classNames('Checkbox is--flex-row', className)}
          {...others}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={this.onCheckboxClick}
            disabled={disabled}
            name={name}
            id={id}
            value={value}
            onFocus={this.toggleFocus}
            onBlur={this.toggleFocus}
            ref={checkbox => {
              this.checkbox = checkbox;
              setRef(this.props.checkboxRef, checkbox);
            }}
            {...checkboxProps}
          />
          <Icon
            className={classNames('Checkbox__overlay', {
              'Checkbox__overlay--disabled': disabled,
              'Checkbox__overlay--focused': focused,
              'Field--has-error': error
            })}
            type={checked ? 'checkbox-checked' : 'checkbox-unchecked'}
            aria-hidden="true"
            onClick={this.onOverlayClick}
          />
          <label
            className={classNames('Field__label', {
              'Field__label--disabled': disabled
            })}
            htmlFor={id}
          >
            {label}
          </label>
        </div>
        <div className="Error" id={this.errorId}>
          {error}
        </div>
      </>
    );
  }
}
