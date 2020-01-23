import { posFilterAction } from 'actions';
import { Selector } from 'components/Selector';
import { connect } from 'connect';
import * as React from 'react';
import { t } from 'translations';
import './index.scss';

interface IPOSSelectorProps {
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

class POSSelector extends React.Component<IPOSSelectorProps> {
    public render() {
        return (
            <div className={'posSelector'}>
                <Selector
                    options={POSList.map(({name, value}) => ({
                        name: t(name),
                        value,
                    }))}
                    onSelect={(pos) => this.props.changePosFilter(pos)}
                    value={this.props.posFilter}
                    label={t('partOfSpeech')}
                />
            </div>
        );
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(POSSelector);
