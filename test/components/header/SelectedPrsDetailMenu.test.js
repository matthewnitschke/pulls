/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

import React from 'react'

import SelectedPrsDetailMenu from '../../../src/components/header/SelectedPrsDetailMenu.jsx';

test('Calls onGroupClick on group menu item', () => {
    const onGroupClick = jest.fn();
    render(<SelectedPrsDetailMenu
        onGroupClick={onGroupClick}
    />)

    userEvent.click(screen.getByRole('button'));
    userEvent.click(screen.getByText('Group'));

    expect(onGroupClick).toBeCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
})

test('Calls onOpenClick on group menu item', () => {
    const onOpenClick = jest.fn();
    render(<SelectedPrsDetailMenu
        onOpenClick={onOpenClick}
    />)

    userEvent.click(screen.getByRole('button'));
    userEvent.click(screen.getByText('Open'));

    expect(onOpenClick).toBeCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
})

test('Calls onCopyClick on group menu item', () => {
    const onCopyClick = jest.fn();
    render(<SelectedPrsDetailMenu
        onCopyClick={onCopyClick}
    />)

    userEvent.click(screen.getByRole('button'));
    userEvent.click(screen.getByText('Copy'));

    expect(onCopyClick).toBeCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
})