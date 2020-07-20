import React from 'react';
import * as ReactDOM from 'react-dom';
import { Basic as ReactPinCodeInput } from '../stories/ReactPinCodeInput.stories';

describe('ReactPinCodeInput', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ReactPinCodeInput />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
