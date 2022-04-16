// src/test/utils/renderConnected.js
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import getStore from '../src/redux/store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Replace this with the appropriate imports for your project


const renderConnected = (
  ui, {
    initialState,
    store = getStore(initialState),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <DndProvider backend={HTML5Backend}>
      <Provider store={store}>{children}</Provider>
    </DndProvider>
  );
  return render(ui, { wrapper: Wrapper, ...renderOptions});
};

export function buildGithubResponse(prData) {
  return JSON.stringify({
    data: {
      search: {
        edges: prData.map(generateDummyPrData)
      }
    }
  })
}

export function generateDummyPrData({
  id,
  status = 'status', 
  org = 'testOrg', 
  repo = 'testRepo', 
  pull = '1234', 
  state = 'testState', 
  title = 'A Test Pr Title', 
  url = 'testUrl', 
  branch = 'testBranch'
}) {
  return {
      node: {
          id: id ?? title.replace(/ /g, '-').toLowerCase() + '-id',
          commits: {
              nodes: [{
                  commit: {
                      status: {
                          state: status
                      }
                  }
              }]
          },
          repository: {
              owner: {
                  login: org,
                  name: repo
              }
          },
          number: pull,
          state: state,
          title: title,
          url: url,
          headRef: {
              name: branch
          }
      }
  }
}

export default renderConnected;
