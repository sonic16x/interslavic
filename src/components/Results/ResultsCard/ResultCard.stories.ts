import type { Meta, StoryObj } from '@storybook/react'

import { ResultsCard } from './ResultsCard'

const meta = {
    title: 'Components/ResultsCard',
    component: ResultsCard,
    parameters: {
        layout: 'padded',
        redux: true,
    },
    tags: ['autodocs'],
    argTypes: {},
    args: {},
} satisfies Meta<typeof ResultsCard>

export default meta
type Story = StoryObj<typeof meta>;

const enIsvItemMock = {
    'translate': 'cat, tom-cat',
    'original': 'kot',
    'add': '',
    'caseInfo': '',
    'details': 'm.anim.',
    'ipa': 'kɔt',
    'id': '1093',
    'checked': true,
    'raw': [
        '1093',
        'kot',
        '',
        'm.anim.',
        'cat, tom-cat',
        'кот',
        'кот',
        'кіт',
        'kot, kocur',
        'kocour, kot',
        'kocúr, kot',
        '!Mačka',
        'mačak, mačor',
        'мачак, мачор',
        'мачор',
        'котарак',
        '!',
    ],
    'from': 'en',
    'to': 'isv',
    'isv': 'kot',
    'originalCyr': 'кот',
    'addCyr': '',
    'caseInfoCyr': ''
}

const isvEnItemMock = {
    'translate': 'cat, tom-cat',
    'original': 'kot',
    'add': '',
    'caseInfo': '',
    'details': 'm.anim.',
    'ipa': 'kɔt',
    'id': '1093',
    'checked': true,
    'raw': ['1093',
        'kot',
        '',
        'm.anim.',
        'cat, tom-cat',
        'кот',
        'кот',
        'кіт',
        'kot, kocur',
        'kocour, kot',
        'kocúr, kot',
        '!Mačka',
        'mačak, mačor',
        'мачак, мачор',
        'мачор',
        'котарак',
        '!',
    ],
    'from': 'isv',
    'to': 'en',
    'isv': 'kot',
    'originalCyr': 'кот',
    'addCyr': '',
    'caseInfoCyr': ''
}

const alphabets = {
    latin: true,
    cyrillic: true,
    glagolitic: false,
}

export const EnIsv: Story = {
    args: {
        item: enIsvItemMock,
        short: false,
        index: 0,
        alphabets,
        caseQuestions: true,
    },
}


export const IsvEn: Story = {
    args: {
        item: isvEnItemMock,
        short: false,
        index: 0,
        alphabets,
        caseQuestions: true,
    },
}

export const NotVerified: Story = {
    args: {
        item: {
            ...isvEnItemMock,
            checked: false,
        },
        short: false,
        index: 0,
        alphabets,
        caseQuestions: true,
    },
}

export const Short: Story = {
    args: {
        item: isvEnItemMock,
        short: true,
        index: 0,
        alphabets,
        caseQuestions: true,
    },
}

export const ShortNotVerified: Story = {
    args: {
        item: {
            ...isvEnItemMock,
            checked: false,
        },
        short: true,
        index: 0,
        alphabets,
        caseQuestions: true,
    },
}
