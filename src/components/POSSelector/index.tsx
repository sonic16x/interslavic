import { posFilterAction } from 'actions';
import { Selector } from 'components/Selector';
import * as React from 'react';
import { t } from 'translations';
import './index.scss';
import { usePosFilter } from 'hooks/usePosFilter';
import { useDispatch } from 'react-redux';

const POSList = [
    {
        name: 'anyPartOfSpeech',
        value: '',
    },
    {
        name: 'noun',
        value: 'noun',
    },
    {
        name: 'pronoun',
        value: 'pron',
    },
    {
        name: 'adjective',
        value: 'adj',
    },
    {
        name: 'verb',
        value: 'v',
    },
    {
        name: 'adverb',
        value: 'adv',
    },
    {
        name: 'numeral',
        value: 'num',
    },
    {
        name: 'preposition',
        value: 'prep',
    },
    {
        name: 'conjunction',
        value: 'conj',
    },
    {
        name: 'interjection',
        value: 'intj',
    },
];

export const POSSelector: React.FC =
    () => {
        const dispatch = useDispatch();
        const posFilter = usePosFilter();
        const options = POSList.map(({name, value}) => ({
            name: t(name),
            value,
        }));
        const onSelect = React.useCallback((pos) => {
            dispatch(posFilterAction(pos));
        }, [dispatch]);

        return (
            <Selector
                className={'pos-selector'}
                options={options}
                onSelect={onSelect}
                value={posFilter}
                label={t('partOfSpeech')}
            />
        );
    };
