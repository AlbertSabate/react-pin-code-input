import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ReactPinCodeInput } from '../.';

const App = () => {
  const numberOfFileds = 6;

  const [value, setValue] = React.useState<Array<string>>(
    Array(numberOfFileds).fill('')
  );

  const onChange = (value: Array<string>) => {
    // You manage the state, if you do not update it consider ReactPinCodeInput useless.
    setValue(value);

    // array or if you prefer to have a simple string.
    console.log(value, value.join(''));
  };

  return (
    <ReactPinCodeInput
      type={`number`}
      autoFocus
      disabled={false}
      invalid={false}
      onInputChange={onChange}
      value={value}
      required
    />
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
