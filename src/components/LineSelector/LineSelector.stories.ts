import { LineSelector } from './LineSelector';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
const meta = {
    title: 'Components/LineSelector',
    component: LineSelector,
    parameters: {
        layout: 'padded',
    },
    argTypes: {},
    args: {
        onSelect: fn()
    },
} satisfies Meta<typeof LineSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        options: [
            'Begin',
            'Entire',
            'Any',
        ].map((text) => ({
            name: text,
            value: text.toLowerCase()
        })),
        value: 'begin'
    },
};

export const SecondSelected: Story = {
    args: {
        options: [
            'Begin',
            'Entire',
            'Any',
        ].map((text) => ({
            name: text,
            value: text.toLowerCase()
        })),
        value: 'entire'
    },
};

