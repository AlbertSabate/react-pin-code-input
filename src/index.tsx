import React, {
  FC,
  HTMLAttributes,
  CSSProperties,
  KeyboardEvent,
  ClipboardEvent,
  createRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';

interface KeyCode {
  BACKSPACE: 'DOM_VK_BACK_SPACE';
  LEFT_ARROW: 'DOM_VK_LEFT';
  UP_ARROW: 'DOM_VK_UP';
  RIGHT_ARROW: 'DOM_VK_RIGHT';
  DOWN_ARROW: 'DOM_VK_DOWN';
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
  BACKSPACE: 'DOM_VK_BACK_SPACE',
  LEFT_ARROW: 'DOM_VK_LEFT',
  UP_ARROW: 'DOM_VK_UP',
  RIGHT_ARROW: 'DOM_VK_RIGHT',
  DOWN_ARROW: 'DOM_VK_DOWN',
};

const patterns: Patterns = {
  number: /^$|^([0-9])$/,
  tel: /^$|^([0-9])$/,
  text: /^$|^(.)$/,
  password: /^$|^(.)$/,
};

export const uuidv4 = (): string =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });

export const ReactPinCodeInput: FC<ReactPinCodeInputProps> = ({
  type,
  value: stateValues,
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
  const refs = Array.from({ length: stateValues.length }).map(() =>
    createRef<HTMLInputElement>()
  );

  const onChange = (
    value: string,
    index: number,
    direction: 'next' | 'prev' | 'current' = 'current'
  ) => {
    const focusIndex = {
      current: index,
      next: index + 1 >= refs.length ? refs.length - 1 : index + 1,
      prev: index - 1 < 0 ? 0 : index - 1,
    };
    const ref = refs[index]?.current;
    const changedValues = [...stateValues];

    if (ref) {
      const checkPattern = pattern || patterns[type];
      if (checkPattern && !checkPattern.test(value)) {
        ref.value = changedValues[index];
        return;
      }

      changedValues[index] = value;
      ref.value = changedValues[index];
      setFocusIndex(focusIndex[direction]);
      onInputChange(changedValues);
    }
  };

  const onChangeAll = (values: Array<string>, setIndex: number) => {
    for (const [key, value] of values.entries()) {
      const ref = refs[key]?.current;

      if (ref) {
        ref.value = stateValues[key];

        const checkPattern = pattern || patterns[type];
        if (checkPattern && !checkPattern.test(value)) {
          values[key] = stateValues[key];
          ref.value = stateValues[key];
        }
      }
    }

    setFocusIndex(setIndex);
    onInputChange(values);
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>, index: number) => {
    const values = [...stateValues];
    const clipboardValues = e.clipboardData.getData('Text').split('');
    for (const [key, value] of clipboardValues.entries()) {
      const ref = refs[index + key]?.current;

      if (ref) {
        values[index + key] = value;
      }
    }

    onChangeAll(
      values,
      index + clipboardValues.length >= refs.length
        ? refs.length - 1
        : index + clipboardValues.length
    );
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    const current = refs[index].current;
    const next = refs[index + 1]?.current;
    const prev = refs[index - 1]?.current;

    if (!(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
    }

    switch (e.key) {
      case keyCode.BACKSPACE:
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          onChangeAll(Array<string>(stateValues.length).fill(''), 0);
        } else if (current?.value !== '') {
          onChange('', index, 'prev');
        } else if (current?.value === '') {
          onChange('', index - 1, 'current');
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
        } else if (
          (checkPattern && !checkPattern.test(e.key)) ||
          e.ctrlKey ||
          e.metaKey
        ) {
        } else if (current) {
          onChange(e.key, index, 'next');
        }
    }
  };

  return (
    <div
      id={uuid}
      className={invalid ? `${className} invalid` : className}
      style={disableInlineStyles ? {} : { ...defaultStyle, ...style }}
    >
      {refs.map((ref, index) => (
        <input
          key={`${uuid}-${index}`}
          id={`${uuid}-${index}`}
          data-id={`${index}`}
          type={type}
          autoFocus={index === focusIndex}
          value={stateValues[index]}
          ref={ref}
          onChange={(e) => onChange(e.currentTarget.value, index)}
          onKeyDown={(e) => onKeyDown(e, index)}
          onPaste={(e) => onPaste(e, index)}
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
