import { Button } from './Button';
import { ComponentMeta,ComponentStory } from '@storybook/react';

export default {
    title: 'Button',
    component: Button,
} as ComponentMeta<typeof Button>;

function createCase(props): ComponentStory<typeof Button> {
    const storyCase = () => (
        <Button
            {...props}
        />
    );

    return storyCase;
}

export const PrimarySizeL = createCase({
    size: 'L',
    title: 'Example Title',
    type: 'primary',
});

export const PrimarySizeM = createCase({
    size: 'M',
    title: 'Example Title',
    type: 'primary',
});

export const PrimarySizeS = createCase({
    size: 'S',
    title: 'Example Title',
    type: 'primary',
});

export const PrimaryNotFill = createCase({
    size: 'M',
    title: 'Example Title',
    type: 'primary',
    fill: false,
});

export const Disabled = createCase({
    size: 'M',
    title: 'Example Title',
    disabled: true,
});

export const Error = createCase({
    size: 'M',
    title: 'Example Title',
    type: 'error',
});

export const Muted = createCase({
    size: 'M',
    title: 'Example Title',
    type: 'muted',
});
