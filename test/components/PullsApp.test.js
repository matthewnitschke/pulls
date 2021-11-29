/**
 * @jest-environment jsdom
 */

import {render, screen, getByLabelText, getByRole, waitFor} from '@testing-library/react'
import {logRoles} from '@testing-library/dom'
import '@testing-library/jest-dom'
import React from 'react'

import userEvent from '@testing-library/user-event'

import PullsApp from '../../src/components/PullsApp.jsx';

// test to write:

// no structure, select a few prs, add group. verify results
// existing group, select a few prs, add to existing group. verify results

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
            constructor() {
                this.storage = {
                    github: 'someAuthKey',
                    githubUser: 'someGithubUser',
                    githubQuery: 'someQuery'
                }
            }

            has(key) { return this.storage.hasOwnProperty(key) }
            get(val) { return this.storage[val] }
            set(key, val) { this.storage[val] = val }
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
                edges: [
                    generateDummyPrData({name: 'test pr 1', id: '1'}),
                    generateDummyPrData({name: 'test pr 2', id: '2'}),
                ]
            }
        }
    }),
  })
);

test('Can create a group', async () => {
    render(<PullsApp />)
    await waitFor(() => screen.getAllByRole('listitem')[0])

    userEvent.click(screen.getAllByRole('listitem')[0], {shiftKey: true})
    userEvent.click(screen.getAllByRole('listitem')[1], {shiftKey: true})

    userEvent.click(screen.getByRole('button', { name: 'selected pr details' }))
    userEvent.click(screen.getByRole('menuitem', { name: /group/i }))

    let modal = document.querySelector('.swal-modal')
    userEvent.type(getByRole(modal, 'textbox'), 'test group')
    // screen.debug();
    logRoles(modal);
    userEvent.click(getByRole(modal, 'button'))

    expect(screen.getByText('test group')).toBeInTheDocument();
})