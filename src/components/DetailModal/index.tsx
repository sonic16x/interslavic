import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { hideDetailAction, setAlphabetTypeAction } from 'actions';
import { declensionNoun } from 'utils/legacy/declensionNoun';
import { declensionAdjective } from 'utils/legacy/declensionAdjective';
import { conjugationVerb } from 'utils/legacy/conjugationVerb';
import { LineSelector } from 'components/LineSelector';
import Table from 'components/Table';
import Text from 'components/Text';
import {
    getGender,
    getPartOfSpeech,
    getVerbType,
    isAnimated,
    isPlural,
} from 'utils/wordDetails';
import { getCyrillic, getField, getLatin, getWordList } from 'utils/translator';

interface IDetailModalProps {
    close: () => void;
    item: any;
    alphabetType: string;
    isDetailModal: boolean;
    flavorisationType: string;
    setAlphabetType: (type: string) => void;
    rawItem: string[];
}

const alphabetType = [
    {
        name: 'Latin',
        value: 'latin',
    },
    {
        name: 'Cyrillic',
        value: 'cyrillic',
    },
];

class DetailModal extends React.Component<IDetailModalProps> {
    constructor(props) {
        super(props);
    }
    public render() {
        if (!this.props.item) {
            return '';
        }
        const pos = getPartOfSpeech(this.props.item.details);

        return (
            <div
                className={'modal' + (this.props.isDetailModal ? ' show' : '')}
                role={'dialog'}
                onClick={() => this.props.close()}
            >
                <div className={'modal-dialog'} role={'document'} onClick={(e) => e.stopPropagation()}>
                    <div className={'modal-content'}>
                        <div className={'modal-header'}>
                            {this.renderTitle(pos)}
                            <button
                                type={'button'}
                                className={'close'}
                                data-dismiss={'modal'}
                                aria-label={'Close'}
                                onClick={() => this.props.close()}
                            >
                                <span aria-hidden={'true'}>&times;</span>
                            </button>
                        </div>
                        <div className={'modal-body'}>
                            {this.renderBody()}
                        </div>
                        <div className={'modal-footer'}>
                            <LineSelector
                                options={alphabetType}
                                value={this.props.alphabetType}
                                onSelect={(type) => this.props.setAlphabetType(type)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    private renderTitle(pos: string) {
        const word = this.props.rawItem[0];
        const add = this.props.rawItem[1];
        const { details } = this.props.item;
        const arr = [pos];
        const animated = isAnimated(details);
        const gender = getGender(details);
        const plural = isPlural(details);
        switch (pos) {
            case 'noun':
                arr.push(gender);
                arr.push(animated ? 'animated' : 'inanimate');
                arr.push(plural ? 'plural' : 'single');
                break;
            case 'verb':
                const verbType = getVerbType(details);
                if (verbType) {
                    arr.push(getVerbType(details));
                }
                break;
        }
        return (
            <h5 className={'modal-title'}>
                {this.formatStr(word)} {this.formatStr(add)} <i>({arr.join(', ')})</i>
            </h5>
        );
    }
    private renderBody() {
        const splitted = this.props.rawItem[0].split(',');
        return splitted.map((word, i) => this.renderWord(
            [
                word.trim(),
                this.props.rawItem[1].indexOf('+') === -1 ? this.props.rawItem[1] : '',
                this.props.rawItem[2],
            ], i, splitted.length > 1));
    }
    private renderWord(rawItem, i, moreOne) {
        const [ word, add, details ] = rawItem;
        let wordComponent;
        switch (getPartOfSpeech(details)) {
            case 'noun':
                wordComponent = this.renderNounDetails(word, add, details);
                break;
            case 'adjective':
                wordComponent = this.renderAdjectiveDetails(word);
                break;
            case 'verb':
                if (!add && word.indexOf(' ') !== -1) {
                    let add2 = '';
                    const BaseWord = getWordList().filter((item) => {
                        if (getField(item, 'isv') === word.split(' ')[0] &&
                            getField(item, 'addition') &&
                            getField(item, 'partOfSpeech').indexOf('v.') !== -1) { return true; }
                        return false;
                    });
                    if (BaseWord.length > 0) {
                        add2 = getField(BaseWord[0], 'addition');
                    }
                    wordComponent = this.renderVerbDetails(word, add2);
                } else {
                    wordComponent = this.renderVerbDetails(word, add);
                }
                break;
            default:
                return '';
        }
        return (
            <div className={'word'} key={i}>
                {moreOne ? <h6>{word}</h6> : ''}
                {wordComponent}
                {moreOne ? <hr/> : ''}
            </div>
        );
    }
    private formatStr(str: string): string {
        if (str === '') {
            return '';
        } else if (str === null) {
            return '&mdash;';
        } else if (str.match(/&\w+;/g)) {
            return str;
        }
        switch (this.props.alphabetType) {
            case 'latin':
                return getLatin(str, this.props.flavorisationType);
            case 'cyrillic':
                return getCyrillic(str, this.props.flavorisationType);
        }
    }
    private renderVerbDetails(word, add) {
        const data = conjugationVerb(word, add);
        if (data === null) {
            return (
                <div>
                    <Text>
                        {`No data for conjugation this verb`}
                    </Text>
                </div>
            );
        }
        const tableDataFirst = [
            [
                '&nbsp@bl;bt;w=2',
                'present@;b',
                'imperfect@;b',
                'future@;b',
            ],
        ];
        const tableDataSecond = [
            [
                '&nbsp@bl;bt;w=2',
                'perfect@;b',
                'pluperfect@;b',
                'conditional@;b',
            ],
        ];
        const tableDataAdd = [
            [
                'infinitive@b',
                this.formatStr(data.infinitive),
            ],
            [
                'imperative@b',
                this.formatStr(data.imperative),
            ],
            [
                'present active participle@b',
                this.formatStr(data.prap),
            ],
            [
                'present passive participle@b',
                this.formatStr(data.prpp),
            ],
            [
                'past active participle@b',
                this.formatStr(data.pfap),
            ],
            [
                'past passive participle@b',
                this.formatStr(data.pfpp),
            ],
            [
                'verbal@b',
                this.formatStr(data.gerund),
            ],
        ];
        const pronouns = [
            'ja',
            'ty',
            'on ona ono',
            'my',
            'vy',
            'oni one',
        ];
        const pronounsFull = [
            'ja',
            'ty',
            'on',
            'ona',
            'ono',
            'my',
            'vy',
            'oni one',
        ];
        const forms = [
            '1sg',
            '2sg',
            '3sg',
            '1pl',
            '2pl',
            '3pl',
        ];
        const formsFull = [
            '1sg',
            '2sg',
            '3sg',
            null,
            null,
            '1pl',
            '2pl',
            '3pl',
        ];
        pronouns.forEach((pronoun, i) => {
            tableDataFirst.push([
                `${forms[i]}@b`,
                `${this.formatStr(pronoun)}@`,
                `${this.formatStr(data.present[i])}@`,
                `${this.formatStr(data.imperfect[i])}@`,
                `${this.formatStr(data.future[i])}@`,
            ]);
        });
        pronounsFull.forEach((pronoun, i) => {
            const item = [
                `${this.formatStr(pronoun)}@`,
                `${this.formatStr(data.perfect[i])}@`,
                `${this.formatStr(data.pluperfect[i])}@`,
                `${this.formatStr(data.conditional[i])}@`,
            ];
            if (formsFull[i]) {
                let str = `${formsFull[i]}@b`;
                if (formsFull[i] === '3sg') {
                    str += ';h=3';
                }
                item.unshift(str);
            }
            tableDataSecond.push(item);
        });
        return (
            <>
                <Table key={0} data={tableDataFirst}/>
                <Table key={1} data={tableDataSecond}/>
                <Table key={2} data={tableDataAdd}/>
            </>
        );
    }
    private renderAdjectiveDetails(word) {
        const { singular, plural, comparison } = declensionAdjective(word);

        const tableDataSingular = [
            [
                '&nbsp@bb;bl;bt',
                'singular@w=3;b',
            ],
            [
                '&nbsp@bl;bt',
                'masculine@b',
                'neuter@b',
                'feminine@b',
            ],
            [
                'Nom@b',
                `${this.formatStr(singular.nom[0])}@`,
                `${this.formatStr(singular.nom[1])}@h=2`,
                `${this.formatStr(singular.nom[2])}@`,
            ],
            [
                'Acc@b',
                `${this.formatStr(singular.acc[0])}@`,
                `${this.formatStr(singular.acc[1])}@`,
            ],
            [
                'Gen@b',
                `${this.formatStr(singular.gen[0])}@w=2`,
                `${this.formatStr(singular.gen[1])}@`,
            ],
            [
                'Dat@b',
                `${this.formatStr(singular.dat[0])}@w=2`,
                `${this.formatStr(singular.dat[1])}@`,
            ],
            [
                'Ins@b',
                `${this.formatStr(singular.ins[0])}@w=2`,
                `${this.formatStr(singular.ins[1])}@`,
            ],
            [
                'Loc@b',
                `${this.formatStr(singular.loc[0])}@w=2`,
                `${this.formatStr(singular.loc[1])}@`,
            ],
        ];

        const tableDataPlural = [
            [
                '&nbsp@bb;bl;bt',
                'plural@w=2;b',
            ],
            [
                '&nbsp@bl;bt',
                'masculine@b',
                'feminine/neuter@b',
            ],
            [
                'Nom@b',
                `${this.formatStr(plural.nom[0])}@`,
                `${this.formatStr(plural.nom[1])}@h=2`,
            ],
            [
                'Acc@b',
                `${this.formatStr(plural.acc[0])}@`,
            ],
            [
                'Gen@b',
                `${this.formatStr(plural.gen[0])}@w=2`,
            ],
            [
                'Dat@b',
                `${this.formatStr(plural.dat[0])}@w=2`,
            ],
            [
                'Ins@b',
                `${this.formatStr(plural.ins[0])}@w=2`,
            ],
            [
                'Loc@b',
                `${this.formatStr(plural.loc[0])}@w=2`,
            ],
        ];

        const tableDataComparison = [
            [
                'Degrees of comparison@w=3;b',
            ],
            [
                'Positive@b;h=2',
                'adjective@b',
                `${this.formatStr(comparison.positive[0])}@`,
            ],
            [
                'adverb@b',
                `${this.formatStr(comparison.positive[1])}@`,
            ],
            [
                'Comparative@b;h=2',
                'adjective@b',
                `${this.formatStr(comparison.comparative[0])}@`,
            ],
            [
                'adverb@b',
                `${this.formatStr(comparison.comparative[1])}@`,
            ],
            [
                'Superlative@b;h=2',
                'adjective@b',
                `${this.formatStr(comparison.superlative[0])}@`,
            ],
            [
                'adverb@b',
                `${this.formatStr(comparison.superlative[1])}@`,
            ],
        ];
        return (
            <>
                <Table key={0} data={tableDataSingular}/>
                <Table key={1} data={tableDataPlural}/>
                <Table key={2} data={tableDataComparison}/>
            </>
        );
    }
    private renderNounDetails(word, add, details) {
        const gender = getGender(details);
        const animated = isAnimated(details);
        const plural = isPlural(details);

        const cases = declensionNoun(word, add, gender, animated, plural);

        if (cases === null) {
            return (
                <div>
                    <Text>
                        {`No data for declination this word/phrase`}
                    </Text>
                </div>
            );
        }

        const prepositions = [
            '&mdash;',
            'na',
            'bez',
            'o',
            'k',
            's',
            '!',
        ];

        const tableDataCases = [
            [
                'Prep.@b',
                'Case@b',
                'Singular@b',
                'Plural@b',
            ],
        ];

        Object.keys(cases).forEach((item, i) => {
            const upperCaseName = `${item[0].toUpperCase()}${item.slice(1)}`;
            let pre;
            if (prepositions[i] === '') {
                pre = '&mdash;';
            }
            if (!pre && prepositions[i] !== '!') {
                pre = `${this.formatStr(prepositions[i])}@`;
            } else if (!pre) {
                pre = '!@';
            }
            tableDataCases.push([
                pre,
                `${upperCaseName}@b`,
                `${this.formatStr(cases[item][0])}@`,
                `${this.formatStr(cases[item][1])}@`,
            ]);
        });

        return <Table data={tableDataCases}/>;
    }
}

function mapDispatchToProps(dispatch) {
    return {
        close: () => dispatch(hideDetailAction()),
        setAlphabetType: (type) => dispatch(setAlphabetTypeAction(type)),
    };
}

function mapStateToProps({detailModal, isDetailModal, results, rawResults, alphabetType, flavorisationType}) {
    return {
        item: results[detailModal],
        rawItem: rawResults[detailModal],
        alphabetType,
        isDetailModal,
        flavorisationType,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailModal);
