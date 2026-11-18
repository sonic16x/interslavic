import { t } from 'translations'

import { IAlphabets } from 'reducers'

import { ITranslateResult } from 'services'

import { splitLemmas } from 'utils'

import { Clipboard } from 'components'
import { LemmaPill, showsLemmaPills } from 'components/Results/ResultsCardWordStatus'

import './ResultsCardOriginal.scss'

interface IResultsCardOriginalProps {
    item: ITranslateResult;
    alphabets: IAlphabets;
    caseQuestions: boolean;
    short: boolean;
}

/** One line per enabled alphabet, words with their additions; the case questions go next to them. */
export function scriptLines(item: ITranslateResult, alphabets: IAlphabets, caseQuestions: boolean) {
    const withAdd = (str: string, add: string) => (add ? `${str} ${add}` : str)

    return [
        alphabets.latin && {
            str: withAdd(item.original, item.add),
            caseInfo: caseQuestions && item.caseInfo,
            lang: 'isv-Latin',
        },
        alphabets.cyrillic && {
            str: withAdd(item.originalCyr, item.addCyr),
            caseInfo: item.caseInfoCyr,
            lang: 'isv-Cyrl',
        },
        alphabets.glagolitic && {
            str: withAdd(item.originalGla, item.addGla),
            caseInfo: item.caseInfoGla,
            lang: 'isv-Glag',
        },
    ].filter(Boolean) as { str: string, caseInfo: string | false, lang: string }[]
}

export const ResultsCardOriginal = ({ item, alphabets, caseQuestions, short }: IResultsCardOriginalProps) => {
    const result = scriptLines(item, alphabets, caseQuestions)
    const pills = showsLemmaPills(item)
    const count = splitLemmas(item.isv).length

    return (
        <span className="results-card-original">
            <span className="words">
                {result.map(({ str, caseInfo }, row) => {
                    // every script line splits into its lemmas; the first one also gets a pill after each
                    const parts = str.split(', ')
                    const perLemma = parts.length === count

                    return (
                        <span className="word" key={str}>
                            {perLemma ? parts.map((part, i) => (
                                <span key={part}>
                                    {/* a click copies the lemma, as before; its pill opens the lemma window */}
                                    <Clipboard str={part} lang="isv" />
                                    {row === 0 && pills && <LemmaPill item={item} index={i} />}
                                    {i < parts.length - 1 && ', '}
                                </span>
                            )) : <Clipboard str={str} lang="isv" />}
                            {caseInfo && <span className="caseInfo">({caseInfo})</span>}
                        </span>
                    )
                })}
            </span>
            {!caseQuestions && item.caseInfo &&
                <span className="caseInfo">(+{t(`case${item.caseInfo.slice(1)}`)})</span>
            }
            {!short && item.ipa && <span className="ipa">[{item.ipa}]</span>}
        </span>
    )
}
