/**
 * @jest-environment jsdom
 */
const { render, screen } = require('@testing-library/react');

import React from 'react';
import PullsApp from '../../src/components/PullsApp';
import renderConnected, {buildGithubResponse} from '../test-utils';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import getStore from '../../src/redux/store';

import { fetchPrs } from '../../src/redux/prs_slice.js';

jest.mock('electron');
jest.mock('electron-store');

test('handles bad github api', async () => {
  let store = getStore({
    activeQueryIndex: 0,
    config: {
      queries: [{ label: 'Query A', query: 'is:pr' }],
    },
    structure: {
      'is:pr': [{ id: 'group-id', name: 'Group Name', prIds: ['a-id', 'b-id'] }]
    }
  });

  renderConnected(<PullsApp />, {
    store
  });

  fetch.mockResponseOnce(
    buildGithubResponse([
      { id: 'a-id', title: 'A' },
      { id: 'b-id', title: 'B' },
    ])
  )
  await store.dispatch(fetchPrs());

  // emulate the the flakey api response (missing b-id pr)
  fetch.mockResponseOnce(
    buildGithubResponse([
      { id: 'a-id', title: 'A' },
    ])
  )
  await store.dispatch(fetchPrs());

  fetch.mockResponseOnce(
    buildGithubResponse([
      { id: 'a-id', title: 'A' },
      { id: 'b-id', title: 'B' },
    ])
  )
  await store.dispatch(fetchPrs());

  expect(screen.queryByText('A')).not.toBeInTheDocument();
  expect(screen.queryByText('B')).not.toBeInTheDocument();

  userEvent.click(screen.getByText('Group Name'))

  expect(screen.getByText('A')).toBeInTheDocument();
  expect(screen.getByText('B')).toBeInTheDocument();
});
