import { t } from 'translations'

import { IAlphabets } from 'reducers'

import { ITranslateResult } from 'services'

import { Clipboard } from 'components'

import './ResultsCardOriginal.scss'

interface IResultsCardOriginalProps {
    item: ITranslateResult;
    alphabets: IAlphabets;
    caseQuestions: boolean;
    short: boolean;
    lang?: string;
}

export const ResultsCardOriginal = ({ item, alphabets, caseQuestions, short, lang }: IResultsCardOriginalProps) => {
    let latin = item.original
    if (item.add) {
        latin += ` ${item.add}`
    }

    let cyrillic = item.originalCyr
    if (item.addCyr) {
        cyrillic += ` ${item.addCyr}`
    }

    let gla = item.originalGla
    if (item.addGla) {
        gla += ` ${item.addGla}`
    }

    const result = []

    if (alphabets.latin) {
        result.push({
            str: latin,
            caseInfo: caseQuestions && item.caseInfo,
            lang: 'isv-Latin',
        })
    }

    if (alphabets.cyrillic) {
        result.push({
            str: cyrillic,
            caseInfo: item.caseInfoCyr,
            lang: 'isv-Cyrl',
        })
    }

    if (alphabets.glagolitic) {
        result.push({
            str: gla,
            caseInfo: item.caseInfoGla,
            lang: 'isv-Glag',
        })
    }

    return (
        <span className="results-card-original">
            <span className="words">
                {result.map(({ str, caseInfo }) => (
                    <span className="word" key={str}>
                        <Clipboard str={str} lang={lang} />
                        {caseInfo && <span className="caseInfo">({caseInfo})</span>}
                    </span>
                ))}
            </span>
            {!caseQuestions && item.caseInfo &&
                <span className="caseInfo">(+{t(`case${item.caseInfo.slice(1)}`)})</span>
            }
            {!short && item.ipa && <span className="ipa">[{item.ipa}]</span>}
        </span>
    )
}
