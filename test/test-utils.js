// src/test/utils/renderConnected.js
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import getStore from '../src/redux/store';

// Replace this with the appropriate imports for your project

const renderConnected = (ui, { initialState, store = getStore(initialState), ...renderOptions } = {}) => {
  const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export default renderConnected;
