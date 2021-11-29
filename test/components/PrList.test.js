
/**
 * @jest-environment jsdom
 */

import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'

import PrList from '../../src/components/PrList.jsx';

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

test('PrList', () => {
    render(<PrList 
        prs={{
            'a': { id: 'a', name: 'someName' }
        }} 
        structure={[
            'a'
        ]} 
        selectedItemIds={[]}
    />)

    expect(screen.getByText('someName')).toBeInTheDocument();
})