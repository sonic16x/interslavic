import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Checkbox } from './Checkbox'

const meta = {
    title: 'Components/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {

    },
    args: { onChange: fn() },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
    args: {
        title: 'Checkbox',
        checked: true,
    },
}

export const Unchecked: Story = {
    args: {
        title: 'Checkbox',
        checked: false,
    },
}
