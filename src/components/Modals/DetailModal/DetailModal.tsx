import { Component } from 'react'
import { connect } from 'react-redux'

import { alphabetTypes } from 'consts'

import { t } from 'translations'

import { hideModalDialog, setAlphabetTypeAction } from 'actions'
import { IMainState } from 'reducers'

import {
    getCaseTips,
    getCyrillic,
    getGender,
    getGlagolitic,
    getLatin,
    getNumeralType,
    getPartOfSpeech,
    getPronounType,
    getVerbDetails,
    isAnimate,
    isComparative,
    isIndeclinable,
    isPlural,
    isSingular,
    isSuperlative,
} from 'utils'

import { LineSelector, Table, Text } from 'components'

import './DetailModal.scss'

import {
    conjugationVerb,
    declensionAdjective,
    declensionNoun,
    declensionNumeral,
    declensionPronoun
} from '@interslavic/utils'

interface IDetailModalInternal {
    close: () => void;
    word: string;
    add: string;
    details: string;
    alphabetType: string;
    alphabets: any;
    flavorisationType: string;
    interfaceLang: string;
    setAlphabetType: (type: string) => void;
    orderOfCases: string[];
    displayImperfect: boolean;
}

/* eslint-disable max-len */
class DetailModalInternal extends Component<IDetailModalInternal> {
    public render() {
        if (!this.props.word) {
            return null
        }

        const pos = getPartOfSpeech(this.props.details)

        return (
            <>
                <div className="modal-dialog__header">
                    {this.renderTitle(pos)}
                    <button
                        className="modal-dialog__header-close"
                        onClick={this.props.close}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                <div className="modal-dialog__body">
                    {this.renderBody()}
                </div>
                {this.renderFooter()}
            </>
        )
    }

    private renderFooter() {
        const options = alphabetTypes
            .filter(({ value }) => this.props.alphabets[value])
            .map((item) => ({ name: t(item.name), value: item.value }))
        

        if (options.length === 1) {
            return null
        }

        return (
            <footer className="modal-dialog__footer">
                <LineSelector
                    options={options}
                    value={this.props.alphabetType}
                    onSelect={(type) => this.props.setAlphabetType(type)}
                />
            </footer>
        )
    }

    private renderTitle(pos: string) {
        const { details, word, add } = this.props
        const arr = [t(pos)]

        switch (pos) {
            case 'noun': {
                const gender = getGender(details)
                const animate = isAnimate(details)
                arr.push(t('noun-' + gender))
                if (gender.match(/masculine/)) {
                    arr.push(t(animate ? 'noun-animate' : 'noun-inanimate'))
                }
                if (isIndeclinable(details)) {
                    arr.push(t('noun-indeclinable'))
                }
                if (isPlural(details)) {
                    arr.push(t('noun-plural'))
                }
                if (isSingular(details)) {
                    arr.push(t('noun-singular'))
                }
                break
            }
            case 'adjective': {
                if (isComparative(details)) {
                    arr.push(t('comparative') + ' ' + t('degree'))
                } else if (isSuperlative(details)) {
                    arr.push(t('superlative') + ' ' + t('degree'))
                }
                break
            }
            case 'verb': {
                const verbDetails = getVerbDetails(details)
                if (verbDetails) {
                    arr.push(...verbDetails.map((e) => t('verb-' + e)))
                }
                break
            }
            case 'numeral': {
                const numeralType = getNumeralType(details)
                if (numeralType) {
                    arr.push(t('numeral-' + numeralType))
                }
                break
            }
            case 'pronoun': {
                const pronounType = getPronounType(details)
                if (pronounType) {
                    arr.push(t('pronoun-' + pronounType))
                }
                break
            }
        }

        return (
            <span className="modal-dialog__header-title">
                {this.formatStr(word)} {this.formatStr(add)} <span className="details">({arr.join(', ')})</span>
            </span>
        )
    }

    private renderBody() {
        const fieldIsv = this.props.word
        const fieldAddition = this.props.add
        const fieldPartOfSpeech = this.props.details
        const splitted = fieldIsv.split(',')
        if (splitted.length === 1 && fieldPartOfSpeech.indexOf('m./f.') !== -1 ) {
            return [
                this.renderWord([fieldIsv, fieldAddition, 'm.'],
                    ['showTitle', 'showGender', 'oneMore'], 0),
                this.renderWord([fieldIsv, fieldAddition, 'f.'],
                    ['showTitle', 'showGender'], 1),
            ]
        }

        return splitted.map((word, i) => {
            const options = []
            if (splitted.length > 1) {
                options.push('showTitle')
                if (i < splitted.length - 1) { options.push('oneMore') }
            }

            return this.renderWord([word.trim(), fieldAddition,  fieldPartOfSpeech], options, i)
        })
    }

    private renderWord(rawItem, options: string[], i) {
        const [ word, add, details ] = rawItem
        let wordComponent
        let remark = ''
        switch (getPartOfSpeech(details)) {
            case 'noun':
                if (options.includes('showGender')) {
                    remark = (details === 'm.' ? ' (' + t('noun-masculine') + ')' : ' (' + t('noun-feminine') + ')')
                }
                wordComponent = this.renderNounDetails(word, add, details)
                break
            case 'adjective':
                wordComponent = this.renderAdjectiveDetails(word, details)
                break
            case 'verb':
                wordComponent = this.renderVerbDetails(word, add, details)
                break
            case 'numeral':
                wordComponent = this.renderNumeralDetails(word, details)
                break
            case 'pronoun':
                wordComponent = this.renderPronounDetails(word, details)
                break
            default:
                return ''
        }

        return (
            <div className="word" key={i}>
                {options.includes('showTitle') ? <h6>{this.formatStr(word)}{remark}</h6> : ''}
                {wordComponent}
                {options.includes('oneMore') ? <hr/> : ''}
            </div>
        )
    }

    private formatStr(str: string): string {
        if (str === '') {
            return ''
        } else if (str == null) {
            return '&mdash;'
        } else if (str.match(/&\w+;/g)) {
            return str
        }
        switch (this.props.alphabetType) {
            case 'latin':
                return getLatin(str, this.props.flavorisationType)
            case 'cyrillic':
                return getCyrillic(str, this.props.flavorisationType)
            case 'glagolitic':
                return getGlagolitic(str, this.props.flavorisationType)
        }
    }

    private renderVerbDetails(word, add, details) {
        const data = conjugationVerb(word, add, details)
        if (data === null) {
            return (
                <div>
                    <Text>
                        {'No data for conjugation this verb'}
                    </Text>
                </div>
            )
        }
        const tableData1 = [
            [
                '&nbsp@bl;bt;w=2',
                `${t('present')}@;b`,
                ...(this.props.displayImperfect ? [`${t('simplePast')}@;b`] : []),
                `${t('future')}@;b`,
            ],
        ]
        const forms1 = [
            '1sg',
            '2sg',
            '3sg',
            '1pl',
            '2pl',
            '3pl',
        ]
        const pronouns1 = [
            'ja',
            'ty',
            'on ona ono',
            'my',
            'vy',
            'oni one',
        ]
        pronouns1.forEach((pronoun, i) => {
            tableData1.push([
                `${t(forms1[i])}@b`,
                `${this.formatStr(pronoun)}@`,
                `${this.formatStr(data.present[i])}@`,
                ...(this.props.displayImperfect ? [`${this.formatStr(data.imperfect[i])}@`] : []),
                `${this.formatStr(data.future[i])}@`,
            ])
        })
        const tableData2 = [
            [
                '&nbsp@bl;bt;w=2',
                `${t(this.props.displayImperfect ? 'perfect' : 'past')}@;b`,
                ...(this.props.displayImperfect ? [`${t('pluperfect')}@;b`] : []),
                `${t('conditional')}@;b`,
            ],
        ]
        const forms2 = [
            '1sg',
            '2sg',
            '3sg',
            null,
            null,
            '1pl',
            '2pl',
            '3pl',
        ]
        const pronouns2 = [
            'ja',
            'ty',
            'on',
            'ona',
            'ono',
            'my',
            'vy',
            'oni one',
        ]
        pronouns2.forEach((pronoun, i) => {
            const item = [
                `${this.formatStr(pronoun)}@`,
                `${this.formatStr(data.perfect[i])}@`,
                ...(this.props.displayImperfect ? [`${this.formatStr(data.pluperfect[i])}@`] : []),
                `${this.formatStr(data.conditional[i])}@`,
            ]
            if (forms2[i]) {
                let str = `${t(forms2[i])}@b`
                if (forms2[i] === '3sg') {
                    str += ';h=3'
                }
                item.unshift(str)
            }
            tableData2.push(item)
        })

        const tableData =
            [...tableData1,
                ['@w=2;bb;bl;br', '@w=3;bl;br'],
                ...tableData2]

        const tableDataAdd = [
            [
                `${t('infinitive')}@b`,
                this.formatStr(data.infinitive),
            ],
            [
                `${t('imperative')}@b`,
                this.formatStr(data.imperative),
            ],
            [
                `${t('presentActiveParticiple')}@b`,
                this.formatStr(data.prap),
            ],
            [
                `${t('presentPassiveParticiple')}@b`,
                this.formatStr(data.prpp),
            ],
            [
                `${t('pastActiveParticiple')}@b`,
                this.formatStr(data.pfap),
            ],
            [
                `${t('pastPassiveParticiple')}@b`,
                this.formatStr(data.pfpp),
            ],
            [
                `${t('verbalNoun')}@b`,
                this.formatStr(data.gerund),
            ],
        ]

        return (
            <>
                <Table key={0} data={tableData}/>
                <Table key={2} data={tableDataAdd}/>
            </>
        )
    }

    private renderAdjectiveDetails(word, details) {
        const { singular, plural, comparison } = declensionAdjective(word, '', details)

        const tableDataSingular = this.getAdjectiveSingularCasesTable(singular)
        const tableDataPlural = this.getAdjectivePluralCasesTable(plural)
        const tableDataComparison = [
            [
                `${t('degreesOfComparison')}@b`,
                `${t('adjective')}@b`,
                `${t('adverb')}@b`,
            ],
            [
                `${t('positive')}@b`,
                `${this.formatStr(comparison.positive[0])}@`,
                `${this.formatStr(comparison.positive[1])}@`,
            ],
            [
                `${t('comparative')}@b`,
                `${this.formatStr(comparison.comparative[0])}@`,
                `${this.formatStr(comparison.comparative[1])}@`,
            ],
            [
                `${t('superlative')}@b`,
                `${this.formatStr(comparison.superlative[0])}@`,
                `${this.formatStr(comparison.superlative[1])}@`,
            ],
        ]

        return (
            <>
                <Table key={0} data={tableDataSingular}/>
                <Table key={1} data={tableDataPlural}/>
                <Table key={2} data={tableDataComparison}/>
            </>
        )
    }

    private renderNounDetails(word, add, details) {
        const gender = getGender(details)
        const animate = isAnimate(details)
        const plural = isPlural(details)
        const singular = isSingular(details)
        const indeclinable = isIndeclinable(details)

        const cases = declensionNoun(word, add, gender, animate, plural, singular, indeclinable)

        if (cases === null) {
            return (
                <div>
                    <Text>
                        {'No data for declination this word/phrase'}
                    </Text>
                </div>
            )
        }

        const tableDataCases = this.getSimpleCasesTable({
            columns: ['singular', 'plural'],
            cases,
        })

        return <Table data={tableDataCases}/>
    }

    private getSimpleCasesTable(paradigmArray) {
        const tableDataCases = [[ `${t('case')}@b` ]]
        paradigmArray.columns.forEach((col) => {
            tableDataCases[0].push(t(col) + '@b')
        })
        this.props.orderOfCases.forEach((caseItem) => {
            if (caseItem in paradigmArray.cases) {
                const caseName = t(`case${caseItem[0].toUpperCase()}${caseItem.slice(1)}`)
                const tableRow = [`${caseName}@b@${this.formatStr(getCaseTips(caseItem, 'noun'))}`]
                paradigmArray.cases[caseItem].forEach((caseForm) => {
                    tableRow.push(`${this.formatStr(caseForm)}@`)
                })
                tableDataCases.push(tableRow)
            }
        })

        return tableDataCases
    }

    private getAdjectiveSingularCasesTable(singular) {
        const table = [
            [
                '&nbsp@bl;bt',
                `${t('singular')}@w=4;b`,
            ],
            [
                `${t('case')}@h=2;b`,
                `${t('masculine')}@w=2;b`,
                `${t('neuter')}@h=2;b`,
                `${t('feminine')}@h=2;b`,
            ],
            [
                `${t('masculineAnimate')}@b`,
                `${t('masculineInanimate')}@b`,
            ],
        ]

        this.props.orderOfCases.forEach((caseItem) => {
            if (caseItem in singular) {
                const tableRow = [
                    `${t(`case${caseItem[0].toUpperCase()}${caseItem.slice(1)}`)}@b@${this.formatStr(getCaseTips(caseItem, 'adjectiveSingular'))}`,
                ]
                switch (caseItem) {
                    case 'nom':
                        tableRow.push(
                            `${this.formatStr(singular[caseItem][0])}@w=2`,
                            `${this.formatStr(singular[caseItem][1])}@`,
                            `${this.formatStr(singular[caseItem][2])}@`,
                        )
                        break
                    case 'acc':
                        tableRow.push(
                            `${this.formatStr(singular[caseItem][0].split(' / ')[0])}@`,
                            `${this.formatStr(singular[caseItem][0].split(' / ')[1])}@`,
                            `${this.formatStr(singular[caseItem][1])}@`,
                            `${this.formatStr(singular[caseItem][2])}@`,
                        )
                        break
                    default:
                        tableRow.push(
                            `${this.formatStr(singular[caseItem][0])}@w=3`,
                            `${this.formatStr(singular[caseItem][1])}@`,
                        )
                        break
                }
                table.push(tableRow)
            }
        })

        return table
    }

    private getAdjectivePluralCasesTable(plural) {
        const table = [
            [
                '&nbsp@bl;bt',
                `${t('plural')}@w=3;b`,
            ],
            [
                `${t('case')}@h=2;b`,
                `${t('masculine')}@w=2;b`,
                `${t('feminineOrNeuter')}@h=2;b`,
            ],
            [
                `${t('masculineAnimate')}@b`,
                `${t('masculineInanimate')}@b`,
            ],
        ]
        this.props.orderOfCases.forEach((caseItem) => {
            if (caseItem in plural) {
                const tableRow = [
                    `${t(`case${caseItem[0].toUpperCase()}${caseItem.slice(1)}`)}@b@${this.formatStr(getCaseTips(caseItem, 'adjectivePlural'))}`,
                ]
                switch (caseItem) {
                    case 'nom':
                    case 'acc':
                        tableRow.push(
                            `${this.formatStr(plural[caseItem][0].split(' / ')[0])}@`,
                            `${this.formatStr(plural[caseItem][0].split(' / ')[1])}@`,
                            `${this.formatStr(plural[caseItem][1])}@`,
                        )
                        break
                    default:
                        tableRow.push(
                            `${this.formatStr(plural[caseItem][0])}@w=3`,
                        )
                        break
                }
                table.push(tableRow)
            }
        })

        return table
    }

    private renderNumeralDetails(word, details) {
        const numeralType = getNumeralType(details)
        const numeralParadigm = declensionNumeral(word, numeralType)
        if (numeralParadigm === null) {
            return (
                <div>
                    <Text>
                        {'No data for declination this word'}
                    </Text>
                </div>
            )
        }

        if (numeralParadigm.type === 'noun') {
            const tableDataCases = this.getSimpleCasesTable(numeralParadigm)

            return <Table data={tableDataCases}/>
        }

        if (numeralParadigm.type === 'adjective') {
            const tableDataSingular = this.getAdjectiveSingularCasesTable(numeralParadigm.casesSingular)
            const tableDataPlural = this.getAdjectivePluralCasesTable(numeralParadigm.casesPlural)

            return (
                <>
                    <Table key={0} data={tableDataSingular}/>
                    <Table key={1} data={tableDataPlural}/>
                </>
            )
        }
    }

    private renderPronounDetails(word, details) {
        const pronounType = getPronounType(details)
        const pronounParadigm = declensionPronoun(word, pronounType)
        if (pronounParadigm === null) {
            return (
                <div>
                    <Text>
                        {'No data for declination this word'}
                    </Text>
                </div>
            )
        }

        if (pronounParadigm.type === 'noun') {
            const tableDataCases = this.getSimpleCasesTable(pronounParadigm)

            return <Table data={tableDataCases}/>
        }

        if (pronounParadigm.type === 'adjective') {
            const tableDataSingular = this.getAdjectiveSingularCasesTable(pronounParadigm.casesSingular)
            const tableDataPlural = this.getAdjectivePluralCasesTable(pronounParadigm.casesPlural)

            return (
                <>
                    <Table key={0} data={tableDataSingular}/>
                    <Table key={1} data={tableDataPlural}/>
                </>
            )
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        close: () => dispatch(hideModalDialog()),
        setAlphabetType: (type) => dispatch(setAlphabetTypeAction(type)),
    }
}

function mapStateToProps({
    modalDialog,
    alphabetType,
    flavorisationType,
    alphabets,
    interfaceLang,
    orderOfCases,
    displayImperfect,
}: IMainState) {
    const { word, add, details } = modalDialog.data

    return {
        word,
        add,
        details,
        alphabetType,
        alphabets,
        flavorisationType,
        interfaceLang,
        orderOfCases,
        displayImperfect,
    }
}

export const DetailModal = connect(mapStateToProps, mapDispatchToProps)(DetailModalInternal as any)
