import { Selector } from './Selector';
import { ComponentMeta,ComponentStory } from '@storybook/react';

export default {
    title: 'Selector',
    component: Selector,
} as ComponentMeta<typeof Selector>;

export const Default: ComponentStory<typeof Selector> = () => (
    <Selector
        options={[
            {
                name: 'One',
                value: 'One',
            },
            {
                name: 'Two',
                value: 'Two',
            },
        ]}
        value="Two"
        label="Label"
        onSelect={() => {}}
    />
);
