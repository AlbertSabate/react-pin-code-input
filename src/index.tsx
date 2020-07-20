import React, {
  FC,
  HTMLAttributes,
  CSSProperties,
  KeyboardEvent,
  FocusEvent,
  createRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';

interface KeyCode {
  BACKSPACE: 8;
  LEFT_ARROW: 37;
  UP_ARROW: 38;
  RIGHT_ARROW: 39;
  DOWN_ARROW: 40;
}

interface Patterns {
  [key: string]: RegExp;
}

type ReactPinCodeInputPropsType = 'text' | 'number' | 'password' | 'tel';
export interface ReactPinCodeInputProps extends HTMLAttributes<HTMLDivElement> {
  type: ReactPinCodeInputPropsType;
  onInputChange: (v: Array<string>) => void;
  value: Array<string>;
  autoFocus?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  pattern?: RegExp;
  required?: boolean;
  className?: string;
  disableInlineStyles?: boolean;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  inputInvalidStyle?: CSSProperties;
}

const defaultStyle: CSSProperties = {
  textAlign: 'center',
};
const defaultInputStyle: CSSProperties = {
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid #ccc',
  borderRadius: 0,
  boxShadow: 'none',
  color: '#3e4958',
  fontFamily: 'unset',
  fontSize: '2rem',
  height: '29px',
  marginRight: '8px',
  outline: 'none',
  padding: '0 0 4px 0',
  textAlign: 'center',
  width: '36px',
  userSelect: 'none',
};

const defaultInvalidInputStyle: CSSProperties = {
  ...defaultInputStyle,
  borderBottom: '1px solid #fcc',
};

const keyCode: KeyCode = {
  BACKSPACE: 8,
  LEFT_ARROW: 37,
  UP_ARROW: 38,
  RIGHT_ARROW: 39,
  DOWN_ARROW: 40,
};

const patterns: Patterns = {
  number: /^$|^([0-9])$/,
  tel: /^$|^([0-9])$/,
};

export const uuidv4 = (): string =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });

export const ReactPinCodeInput: FC<ReactPinCodeInputProps> = ({
  type,
  value: values,
  onInputChange,
  className,
  autoFocus,
  pattern,
  disabled,
  required,
  invalid,
  disableInlineStyles,
  style,
  inputStyle,
  inputInvalidStyle,
}) => {
  const uuid = uuidv4();
  const [focusIndex, setFocusIndex] = useState(autoFocus ? 0 : -1);
  const refs = Array.from({ length: values.length }).map(() =>
    createRef<HTMLInputElement>()
  );

  const onChange = (
    index: number,
    direction: 'next' | 'prev' | 'current' = 'current'
  ) => {
    const focusIndex = {
      current: index,
      next: index + 1 >= refs.length ? refs.length - 1 : index + 1,
      prev: index - 1 < 0 ? 0 : index - 1,
    };
    const current = refs[index]?.current;
    const changedValues = [...values];

    const checkPattern = pattern || patterns[type];
    if (current && checkPattern && !checkPattern.test(current?.value ?? '')) {
      current.value = changedValues[index];
      return;
    }

    changedValues[index] = current?.value ?? '';

    setFocusIndex(focusIndex[direction]);
    onInputChange(changedValues);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    const current = refs[index].current;
    const next = refs[index + 1]?.current;
    const prev = refs[index - 1]?.current;

    e.preventDefault();
    switch (e.keyCode) {
      case keyCode.BACKSPACE:
        if (current && current.value !== '') {
          current.value = '';
          onChange(index, 'prev');
          prev?.focus();
        } else if (prev && current && current.value === '') {
          prev.focus();
          prev.value = '';
          onChange(index - 1, 'current');
        }
        break;
      case keyCode.LEFT_ARROW:
      case keyCode.UP_ARROW:
        prev?.focus();
        break;
      case keyCode.RIGHT_ARROW:
      case keyCode.DOWN_ARROW:
        next?.focus();
        break;
      default:
        const checkPattern = pattern || patterns[type];
        if (current?.value === e.key) {
          next?.focus();
        } else if (checkPattern && !checkPattern.test(e.key)) {
        } else if (current) {
          current.value = e.key;
          onChange(index, 'next');
        }
    }
  };

  const onFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };

  return (
    <div
      className={invalid ? `${className} invalid` : className}
      style={disableInlineStyles ? {} : { ...defaultStyle, ...style }}
    >
      {refs.map((ref, index) => (
        <input
          key={`${uuid}-${index}`}
          type={type}
          autoFocus={index === focusIndex}
          defaultValue={values[index]}
          ref={ref}
          onChange={() => onChange(index)}
          onKeyDown={(e) => onKeyDown(e, index)}
          onFocus={onFocus}
          disabled={disabled}
          required={required}
          autoComplete="off"
          style={
            disableInlineStyles
              ? {}
              : invalid
              ? { ...defaultInvalidInputStyle, ...inputInvalidStyle }
              : { ...defaultInputStyle, ...inputStyle }
          }
        />
      ))}
    </div>
  );
};

ReactPinCodeInput.defaultProps = {
  type: 'number',
  autoFocus: true,
  disabled: false,
  invalid: false,
  disableInlineStyles: false,
  className: `react-pin-code-input`,
};

ReactPinCodeInput.propTypes = {
  type: PropTypes.oneOf<ReactPinCodeInputPropsType>([
    'text',
    'number',
    'password',
    'tel',
  ]).isRequired,
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
