import { posFilterAction } from 'actions';
import { Selector } from 'components/Selector';
import { connect } from 'react-redux';
import * as React from 'react';
import { t } from 'translations';
import './index.scss';

interface IPOSSelectorInternalProps {
    posFilter: string;
    changePosFilter: (pos: string) => void;
}

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

const POSSelectorInternal: React.FC<IPOSSelectorInternalProps> =
    ({changePosFilter, posFilter}: IPOSSelectorInternalProps) => (
        <Selector
            className={'pos-selector'}
            options={POSList.map(({name, value}) => ({
                name: t(name),
                value,
            }))}
            onSelect={(pos) => changePosFilter(pos)}
            value={posFilter}
            label={t('partOfSpeech')}
        />
    );

function mapStateToProps({posFilter}) {
    return {
        posFilter,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changePosFilter: (pos) => dispatch(posFilterAction(pos)),
    };
}

export const POSSelector = connect(mapStateToProps, mapDispatchToProps)(POSSelectorInternal);
