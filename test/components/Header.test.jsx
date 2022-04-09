/**
 * @jest-environment jsdom
 */
const { render, screen } = require('@testing-library/react');

import React from 'react';
import Header from '../../src/components/header/Header';
import renderConnected from '../test-utils';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

test('hides breadcrumb when one query is available', () => {
  renderConnected(<Header />, {
    initialState: {
      activeQueryIndex: 0,
      config: {
        queries: [{ label: 'Query A', query: 'is:pr' }],
      },
    },
  });

  expect(screen.queryByText('Query A')).not.toBeInTheDocument();
});

test('shows breadcrumb when multiple queries are available', () => {
  renderConnected(<Header />, {
    initialState: {
      activeQueryIndex: 0,
      config: {
        queries: [
          { label: 'Query A', query: 'is:pr' },
          { label: 'Query B', query: 'is:pr' },
        ],
      },
    },
  });

  expect(screen.getByText('Query A')).toBeInTheDocument();
});
