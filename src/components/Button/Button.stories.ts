import { Button } from './Button';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

const meta = {
    title: 'Components/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {

    },
    args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
    args: {
        title: 'Button',
        type: 'primary',
    },
};

export const Error: Story = {
    args: {
        title: 'Button',
        type: 'error',
    },
};

export const Muter: Story = {
    args: {
        title: 'Button',
        type: 'muted',
    },
};

export const Small: Story = {
    args: {
        title: 'Button',
        size: 'S',
    },
};

export const Medium: Story = {
    args: {
        title: 'Button',
        size: 'M',
    },
};

export const Large: Story = {
    args: {
        title: 'Button',
        size: 'L',
    },
};

export const NotFill: Story = {
    args: {
        title: 'Button',
        fill: false,
    },
};

export const Disabled: Story = {
    args: {
        title: 'Button',
        disabled: true,
    },
};
