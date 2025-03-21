import type { Meta, StoryObj } from '@storybook/react'

import { ResultsEmpty } from './ResultsEmpty'

const meta = {
    title: 'Components/ResultsEmpty',
    component: ResultsEmpty,
    parameters: {
        layout: 'centered',
        redux: true,
    },
    tags: ['autodocs'],
    argTypes: {

    },
    args: { },
} satisfies Meta<typeof ResultsEmpty>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {

    },
}

export const ShowReset: Story = {
    args: {
        showReset: true
    },
}
