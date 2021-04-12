import { FormEvent, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { ReactPinCodeInput, ReactPinCodeInputProps } from '../src/ReactPinCodeInput';

export default {
  title: 'ReactPinCodeInput',
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const Basic = (props?: Partial<ReactPinCodeInputProps>): JSX.Element => {
  const numberOfFields = 6;

  const [value, setValue] = useState<Array<string>>(Array(numberOfFields).fill(''));

  const onChange = (value: Array<string>) => {
    // You manage the state, if you do not update it consider ReactPinCodeInput useless.
    setValue(value);

    // array or if you prefer to have a simple string.
    console.log(value, value.join(''));
  };

  return <ReactPinCodeInput type={`number`} onInputChange={onChange} value={value} {...props} />;
};

export const Text = (props?: Partial<ReactPinCodeInputProps>): JSX.Element => {
  const numberOfFields = 6;

  const [value, setValue] = useState<Array<string>>(Array(numberOfFields).fill(''));

  return <ReactPinCodeInput type={`text`} onInputChange={setValue} value={value} {...props} />;
};

export const Disabled = (props?: Partial<ReactPinCodeInputProps>): JSX.Element => {
  const numberOfFields = 6;

  const [value, setValue] = useState<Array<string>>(Array(numberOfFields).fill(''));

  return (
    <ReactPinCodeInput
      type={`number`}
      disabled={true}
      onInputChange={setValue}
      value={value}
      {...props}
    />
  );
};

export const Invalid = (props?: Partial<ReactPinCodeInputProps>): JSX.Element => {
  const numberOfFields = 6;

  const [value, setValue] = useState<Array<string>>(Array(numberOfFields).fill(''));

  return (
    <ReactPinCodeInput
      type={`number`}
      invalid={true}
      onInputChange={setValue}
      value={value}
      {...props}
    />
  );
};

export const NoStyle = (props?: Partial<ReactPinCodeInputProps>): JSX.Element => {
  const numberOfFields = 6;

  const [value, setValue] = useState<Array<string>>(Array(numberOfFields).fill(''));

  return (
    <ReactPinCodeInput
      type={`number`}
      onInputChange={setValue}
      value={value}
      disableInlineStyles={true}
      {...props}
    />
  );
};

export const Required = (props?: Partial<ReactPinCodeInputProps>): JSX.Element => {
  const numberOfFields = 6;

  const [value, setValue] = useState<Array<string>>(Array(numberOfFields).fill(''));

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        action('form-submitted')(value.join(''));
      }}
    >
      <ReactPinCodeInput
        type={`number`}
        onInputChange={setValue}
        value={value}
        required
        {...props}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export const NoAutofocus = (props?: Partial<ReactPinCodeInputProps>): JSX.Element => {
  const numberOfFields = 6;

  const [value, setValue] = useState<Array<string>>(Array(numberOfFields).fill(''));

  return (
    <ReactPinCodeInput
      type={`number`}
      autoFocus={false}
      onInputChange={setValue}
      value={value}
      {...props}
    />
  );
};

export const WithPattern = (props?: Partial<ReactPinCodeInputProps>): JSX.Element => {
  const numberOfFields = 6;

  const [value, setValue] = useState<Array<string>>(Array(numberOfFields).fill(''));

  return (
    <ReactPinCodeInput
      type={`number`}
      onInputChange={setValue}
      value={value}
      pattern={/^$|^[1-5]$/}
      {...props}
    />
  );
};

export const CustomStyles = (props?: Partial<ReactPinCodeInputProps>): JSX.Element => {
  const numberOfFields = 6;

  const [invalid, setInvalid] = useState<boolean>(false);
  const [value, setValue] = useState<Array<string>>(Array(numberOfFields).fill(''));

  const changeToInvalid = () => {
    setInvalid(!invalid);
  };

  return (
    <>
      <ReactPinCodeInput
        type={`number`}
        invalid={invalid}
        onInputChange={setValue}
        value={value}
        style={{
          backgroundColor: 'black',
          padding: '10px',
        }}
        inputStyle={{
          color: 'white',
        }}
        inputInvalidStyle={{
          color: 'red',
        }}
        {...props}
      />
      <button onClick={changeToInvalid}>{invalid ? `Change To Valid` : `Change To Invalid`}</button>
    </>
  );
};

export const WithInitialValues = (props?: Partial<ReactPinCodeInputProps>): JSX.Element => {
  const [value, setValue] = useState<Array<string>>([
    '2',
    '3',
    '4',
    '5',
    '',
    '',
    '4',
    '',
    '',
    'e', // This is not going to appear if we do not change the type of input or the default pattern
    '',
    '',
  ]);

  return <ReactPinCodeInput type={`number`} onInputChange={setValue} value={value} {...props} />;
};
