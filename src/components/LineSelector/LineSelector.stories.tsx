import { LineSelector } from './LineSelector';
import { ComponentMeta,ComponentStory } from '@storybook/react';

export default {
    title: 'LineSelector',
    component: LineSelector,
} as ComponentMeta<typeof LineSelector>;

function createCase(props): ComponentStory<typeof LineSelector> {
    const storyCase = () => (
        <LineSelector
            {...props}
        />
    );

    return storyCase;
}

export const Default = createCase({
    options: [
        {
            name: 'One',
            value: 'One',
        },
        {
            name: 'Two',
            value: 'Two',
        },
        {
            name: 'Three',
            value: 'Three',
        },
    ],
    value: 'Two',
    onSelect: () => {},
});
