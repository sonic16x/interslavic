import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Button } from './Button'

const meta = {
    title: 'Components/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {

    },
    args: { onClick: fn() },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        title: 'Button',
        type: 'primary',
    },
}

export const Error: Story = {
    args: {
        title: 'Button',
        type: 'error',
    },
}

export const Muter: Story = {
    args: {
        title: 'Button',
        type: 'muted',
    },
}

export const Small: Story = {
    args: {
        title: 'Button',
        size: 'S',
    },
}

export const Medium: Story = {
    args: {
        title: 'Button',
        size: 'M',
    },
}

export const Large: Story = {
    args: {
        title: 'Button',
        size: 'L',
    },
}

export const NotFill: Story = {
    args: {
        title: 'Button',
        fill: false,
    },
}

export const Disabled: Story = {
    args: {
        title: 'Button',
        disabled: true,
    },
}
