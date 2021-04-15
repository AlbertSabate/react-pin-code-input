import { memo } from 'react';
import PropTypes from 'prop-types';
import { ReactPinCodeInputComponent, ReactPinCodeInputProps } from './ReactPinCodeInput';

// If you are using this file is assumed you have installed prop-types
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
ReactPinCodeInputComponent.propTypes = {
  type: PropTypes.oneOf(['text', 'number', 'password', 'tel']),
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
  onInputChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  className: PropTypes.string,
  pattern: PropTypes.instanceOf(RegExp),
  required: PropTypes.bool,
  disableInlineStyles: PropTypes.bool,
  style: PropTypes.object,
  inputStyle: PropTypes.object,
  inputInvalidStyle: PropTypes.object,
};

export const ReactPinCodeInput = memo<ReactPinCodeInputProps>(ReactPinCodeInputComponent);
