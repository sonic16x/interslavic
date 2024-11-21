import { Controls } from './Controls';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Components/Controls',
    component: Controls,
    parameters: {
        layout: 'padded',
        redux: true,
    },
    argTypes: {},
    args: {},
} satisfies Meta<typeof Controls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {

    },
};

export const Expanded: Story = {
    args: {
        expanded: true
    },
};
