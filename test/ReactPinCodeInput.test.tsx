import ReactDOM from 'react-dom';
import { ReactPinCodeInput } from '../src/ReactPinCodeInput';

describe('ReactPinCodeInput', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ReactPinCodeInput onInputChange={() => undefined} value={[]} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
