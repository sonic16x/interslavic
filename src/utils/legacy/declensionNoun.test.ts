import { declensionNoun } from './declensionNoun';
import {
    getGender,
    getPartOfSpeech,
    getVerbType,
    isAnimated,
    isPlural,
} from 'utils/wordDetails';
import { markFluentVowel } from 'utils/markFluentVowel';

const testCases = [
    {
        description: 'declension kot',
        init: {
            word: 'kot',
            add: '',
            details: 'm.anim.',
        },
        expected: {
            nom: ['kot', 'koti'],
            acc: ['kota', 'kotov'],
            gen: ['kota', 'kotov'],
            loc: ['kotu', 'kotah'],
            dat: ['kotu', 'kotam'],
            ins: ['kotom', 'kotami'],
            voc: ['kote', null],
        },
    },
    {
        description: 'declension pes',
        init: {
            word: 'pes',
            add: '(psa)',
            details: 'm.anim.',
        },
        expected: {
            nom: ['pes', 'pesi'],
            acc: ['pesa', 'pesov'],
            gen: ['pesa', 'pesov'],
            loc: ['pesu', 'pesah'],
            dat: ['pesu', 'pesam'],
            ins: ['pesom', 'pesami'],
            voc: ['pese', null],
        },
    },
    {
        description: 'declension dveri',
        init: {
            word: 'dveri',
            add: '',
            details: 'f.pl.',
        },
        expected: {
            nom: [null, 'dveri'],
            acc: [null, 'dveri'],
            gen: [null, 'dverij'],
            loc: [null, 'dverjah'],
            dat: [null, 'dverjam'],
            ins: [null, 'dverjami'],
            voc: [null, null],
        },
    },
];

testCases.forEach(({ description, init: { word, details, add }, expected}) => {
    it(description, () => {
        let preparedWord = word;

        if (add && word !== add) {
            preparedWord = markFluentVowel(word, add);
        }

        const gender = getGender(details);
        const animated = isAnimated(details);
        const plural = isPlural(details);

        const actual = declensionNoun(preparedWord, add, gender, animated, plural);

        expect(actual).toMatchObject(expected);
    });
});
