/**
 * @jest-environment jsdom
 */

import {render, screen, getByLabelText, getByRole, waitFor} from '@testing-library/react'
import {logRoles} from '@testing-library/dom'
import '@testing-library/jest-dom'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import React from 'react'

import userEvent from '@testing-library/user-event'
import PullsApp from '../../src/components/PullsApp.jsx';

jest.mock(
    'electron',
    () => {
        return { ipcRenderer: { 
            on: jest.fn(), 
            send: jest.fn(),
            sendSync: jest.fn(),
            removeListener: jest.fn(),
        } };
    },
    { virtual: true },
);


jest.mock(
    'electron-store',
    () => {
        return class Store {
            has(key) { return mockStoreData.hasOwnProperty(key) }
            get(val) { return mockStoreData[val] }
            set(key, val) { mockStoreData[val] = val }
        }
    }
)

function generateDummyPrData({
    id = 'testId', 
    status = 'status', 
    org = 'testOrg', 
    repo = 'testRepo', 
    pull = '1234', 
    state = 'testState', 
    title = 'testTitle', 
    url = 'testUrl', 
    branch = 'testBranch'
}) {
    return {
        node: {
            id: id,
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

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
        data: { 
            search: {
                edges: mockPrData
            }
        }
    }),
  })
);

let mockStoreData;
let mockPrData;

function getComponent() {
    return <DndProvider backend={HTML5Backend}>
        <PullsApp automation={true} />
  </DndProvider>;
}

beforeEach(() => {
    mockStoreData = {
        github: 'someAuthKey',
        githubUser: 'someGithubUser',
        githubQuery: 'someQuery'
    }

    mockPrData = [
        generateDummyPrData({title: 'test pr 1', id: '1'}),
        generateDummyPrData({title: 'test pr 2', id: '2'}),
        generateDummyPrData({title: 'test pr 3', id: '3'}),
    ]
});

test('Renders list with folder', async () => {
    mockStoreData['savedStructure'] = ['1', '2', {id: 'g1', name: 'group 1', prIds: ['3']}]

    render(getComponent())
    await waitFor(() => screen.getAllByRole('listitem')[0])

    expect(screen.getByText('test pr 1')).toBeInTheDocument();
    expect(screen.getByText('test pr 2')).toBeInTheDocument();

    expect(screen.queryByText('test pr 3')).not.toBeInTheDocument();
    userEvent.click(screen.getByText('group 1'))
    expect(screen.getByText('test pr 3')).toBeInTheDocument();
})

test('Re-renders list with new pr returned', async () => {
    mockStoreData['savedStructure'] = ['1', '2', {id: 'g1', name: 'group 1', prIds: ['3']}]
    
    render(getComponent())
    await waitFor(() => screen.getAllByRole('listitem')[0])
    
    mockPrData.push(generateDummyPrData({title: 'new pr', id: '4'}));

    userEvent.click(screen.getByRole('button', {name: /refresh/}))
    await waitFor(() => screen.getAllByRole('listitem')[3])

    expect(screen.getByText('test pr 1')).toBeInTheDocument();
    expect(screen.getByText('test pr 2')).toBeInTheDocument();
    expect(screen.getByText('new pr')).toBeInTheDocument();

    expect(screen.queryByText('test pr 3')).not.toBeInTheDocument();
    userEvent.click(screen.getByText('group 1'))
    expect(screen.getByText('test pr 3')).toBeInTheDocument();
})

test('Re-renders list with existing pr removed', async () => {
    mockStoreData['savedStructure'] = ['1', '2', {id: 'g1', name: 'group 1', prIds: ['3']}]
    
    render(getComponent())
    await waitFor(() => screen.getAllByRole('listitem')[0])
    
    mockPrData.pop();

    userEvent.click(screen.getByRole('button', {name: /refresh/}))
    await waitFor(() => screen.getAllByRole('listitem')[3])

    expect(screen.getByText('test pr 1')).toBeInTheDocument();
    expect(screen.getByText('test pr 2')).toBeInTheDocument();

    expect(screen.queryByText('group 1')).not.toBeInTheDocument();
    expect(screen.queryByText('test pr 3')).not.toBeInTheDocument();
})

test.skip('Can create a group', async () => {
    render(getComponent())
    await waitFor(() => screen.getAllByRole('listitem')[0])

    userEvent.click(screen.getAllByRole('listitem')[0], {shiftKey: true})
    userEvent.click(screen.getAllByRole('listitem')[1], {shiftKey: true})

    userEvent.click(screen.getByRole('button', { name: 'selected pr details' }))
    userEvent.click(screen.getByRole('menuitem', { name: /group/i }))

    let modal = document.querySelector('.swal-modal')
    userEvent.type(getByRole(modal, 'textbox'), 'test group')
    logRoles(modal);
    userEvent.click(getByRole(modal, 'button'))

    expect(screen.getByText('test group')).toBeInTheDocument();
})