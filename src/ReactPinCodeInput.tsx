import {
  ClipboardEvent,
  createRef,
  CSSProperties,
  HTMLAttributes,
  KeyboardEvent,
  memo,
  useEffect,
} from 'react';

interface KeyCode {
  BACKSPACE: 'Backspace';
  ENTER: 'Enter';
  LEFT_ARROW_COMPATIBILITY: 'Left';
  LEFT_ARROW: 'ArrowLeft';
  UP_ARROW_COMPATIBILITY: 'Up';
  UP_ARROW: 'ArrowUp';
  RIGHT_ARROW_COMPATIBILITY: 'Right';
  RIGHT_ARROW: 'ArrowRight';
  DOWN_ARROW_COMPATIBILITY: 'Down';
  DOWN_ARROW: 'ArrowDown';
}

interface Patterns {
  [key: string]: RegExp;
}

type InputType = 'text' | 'number' | 'password' | 'tel';

export interface ReactPinCodeInputProps extends HTMLAttributes<HTMLDivElement> {
  type?: InputType;
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
  BACKSPACE: 'Backspace',
  ENTER: 'Enter',
  LEFT_ARROW_COMPATIBILITY: 'Left',
  LEFT_ARROW: 'ArrowLeft',
  UP_ARROW_COMPATIBILITY: 'Up',
  UP_ARROW: 'ArrowUp',
  RIGHT_ARROW_COMPATIBILITY: 'Right',
  RIGHT_ARROW: 'ArrowRight',
  DOWN_ARROW_COMPATIBILITY: 'Down',
  DOWN_ARROW: 'ArrowDown',
};

const patterns: Patterns = {
  number: /^$|^([0-9])$/,
  tel: /^$|^([0-9])$/,
  text: /^$|^(.)$/,
  password: /^$|^(.)$/,
};

export const defaultProps = {
  type: 'number',
  autoFocus: true,
  disabled: false,
  invalid: false,
  disableInlineStyles: false,
  className: 'react-pin-code-input',
  id: 'react-pin-code-input',
};

const getFocusPosition = (array: Array<string>): number => {
  const position = array.findIndex((state) => state === '');

  return position > -1 ? position : array.length;
};

export function ReactPinCodeInputComponent(props: ReactPinCodeInputProps): JSX.Element {
  const {
    id,
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
    ...otherProps
  } = { ...defaultProps, ...props };
  const focusIndex = autoFocus ? getFocusPosition(stateValues) : -1;
  const refs = Array.from({ length: stateValues.length }).map(() => createRef<HTMLInputElement>());
  const checkPattern = pattern || patterns[type];

  useEffect(() => {
    stateValues.forEach((value, index) => {
      const ref = refs[index]?.current;
      if (ref) {
        ref.value = value;
      }
    });
  }, [refs, stateValues]);

  const onChange = (value: string, index: number) => {
    const changedValues = [...stateValues];

    changedValues[index] = value;
    onInputChange(changedValues);
  };

  const onChangeAll = (values: Array<string>) => {
    for (const [key, value] of values.entries()) {
      if (checkPattern && !checkPattern.test(value)) {
        values[key] = '';
      }
    }

    onInputChange(values);
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const values = [...stateValues];
    const clipboardValues = e.clipboardData.getData('Text').split('');
    for (const [key, value] of clipboardValues.entries()) {
      const ref = refs[index + key]?.current;
      if (!ref) {
        break;
      }

      values[index + key] = value;
      const next = refs[index + key + 1]?.current;
      if (next) {
        next.focus();
        continue;
      }

      ref.focus();
    }

    onChangeAll(values);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    const current = refs[index].current;
    const next = refs[index + 1]?.current;
    const prev = refs[index - 1]?.current;
    const isValidKey = checkPattern && checkPattern.test(e.key);

    if (!(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
    }

    switch (e.key) {
      case keyCode.BACKSPACE:
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          onChangeAll(Array<string>(stateValues.length).fill(''));
          refs[0].current?.focus();
        } else if (current?.value !== '') {
          onChange('', index);
        } else if (current?.value === '' && index > 0) {
          onChange('', index - 1);
          prev?.focus();
        }
        break;
      case keyCode.LEFT_ARROW:
      case keyCode.LEFT_ARROW_COMPATIBILITY:
      case keyCode.UP_ARROW:
      case keyCode.UP_ARROW_COMPATIBILITY:
        prev?.focus();
        break;
      case keyCode.RIGHT_ARROW:
      case keyCode.RIGHT_ARROW_COMPATIBILITY:
      case keyCode.DOWN_ARROW:
      case keyCode.DOWN_ARROW_COMPATIBILITY:
        next?.focus();
        break;
      default:
        if (current?.value === e.key) {
          next?.focus();
        } else if (current && isValidKey && !e.ctrlKey && !e.metaKey) {
          onChange(e.key, index);
          next?.focus();
        }
    }
  };

  return (
    <div
      id={id}
      className={invalid ? `${className} invalid` : className}
      style={disableInlineStyles ? {} : { ...defaultStyle, ...style }}
      {...otherProps}
    >
      {refs.map((ref, index) => (
        <input
          key={`${id}-${index}`}
          id={`${id}-${index}`}
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
}

export const ReactPinCodeInput = memo<ReactPinCodeInputProps>(ReactPinCodeInputComponent);
