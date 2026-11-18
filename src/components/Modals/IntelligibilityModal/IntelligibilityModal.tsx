import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'

import { ADD_LANGS, EN, LANGS } from 'consts'

import { t } from 'translations'

import { hideModalDialog } from 'actions'

import { Dictionary, ITranslateResult } from 'services'

import {
    useAlphabets,
    useCaseQuestions,
    useDictionaryLanguages,
    useFlavorisationType,
    useModalDialog,
    useResults,
} from 'hooks'
import {
    band,
    closestTranslation,
    COGNATE_DISTANCE,
    decodeVotes,
    expandAbbr,
    getCyrillic,
    getGlagolitic,
    getLatin,
    getPartOfSpeech,
    lemmaScore,
    perLemma,
    share,
    shareBand,
    splitLemmas,
    UNRELATED_DISTANCE,
    wordHasForms,
} from 'utils'
import { getWordStatus } from 'utils/getWordStatus'

import { Clipboard, LineSelector } from 'components'
import DetailModal from 'components/Modals/DetailModal'
import { scriptLines } from 'components/Results/ResultsCardOriginal/ResultsCardOriginal'
import { Table } from 'components/Table'

import './IntelligibilityModal.scss'


/** Six petals as on slovosbor, clockwise from 1 o'clock: West on the left, East on the right. */
const PETALS = [['be', 'uk'], ['ru'], ['bg', 'mk'], ['hr', 'sr', 'sl'], ['sk', 'cs'], ['pl']]

export const Flower = ({ answers }: { answers: Record<string, number[]> }) => (
    <svg className="intelligibility-modal__flower" viewBox="0 0 100 100" aria-hidden="true">
        {PETALS.map((langs, i) => (
            <ellipse
                key={langs.join()}
                className={band(answers, langs)}
                cx="50"
                cy="30"
                rx="14"
                ry="22"
                transform={`rotate(${30 + i * 60} 50 50)`}
            />
        ))}
        <circle cx="50" cy="50" r="6.5"/>
    </svg>
)

/** Lucide Bot (ISC): a machine translation, a machine's vote */
/** Lucide "globe": the pills' head (⇄ has "languages") */
const GLOBE = ['M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0', 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20', 'M2 12h20']
const BOT = ['M12 8V4H8', 'M6 8h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z',
    'M2 14h2', 'M20 14h2', 'M15 13v2', 'M9 13v2']
/** the same bot as HTML, for the Table's cells: in a pill (machine votes only) and before a machine translation */
const BOT_SVG = [
    '<svg class="results-card-status__bot" viewBox="0 0 24 24" fill="none" stroke="currentColor"',
    ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
    ...BOT.map((d) => `<path d="${d}"/>`),
    '</svg>',
].join('')

/**
 * A language's closest translation to the lemma (the machine vote's distance), struck through when unrelated.
 * "!" marks a machine translation.
 */
const Translation = ({ isv, str, lang }: { isv: string, str: string, lang: string }) => {
    const machine = str[0] === '!'
    const text = machine ? str.slice(1) : str
    const closest = closestTranslation(isv, text, lang)
    const kind = closest == null ? null
        : closest.distance <= COGNATE_DISTANCE ? 'yes' : closest.distance <= UNRELATED_DISTANCE ? 'unsure' : 'no'
    const title = kind && t({ yes: 'intelligibilityMatchYes', unsure: 'intelligibilityMatchUnsure',
        no: 'intelligibilityMatchNone' }[kind])
    const shown = kind === 'no' ? <s>{closest.word}</s> : closest?.word || text.split(', ')[0]

    return (
        <span className="intelligibility-modal__match" title={title || undefined}>
            <span className={machine ? 'intelligibility-modal__muted' : undefined}>
                {machine && <span title={t('translationsLegendMachineTranslations')}><Icon paths={BOT}/> </span>}
                {shown}
            </span>
        </span>
    )
}

/**
 * The translations as the site has always shown them (the Table of master): Interslavic, English, the Slavic
 * languages, the rest. A Slavic language's closest word to the lemma is bold among several and carries the
 * language's share I_l as the card's pill.
 */
const TranslationsTable = ({ item, isv, score, onPill }: {
    item: ITranslateResult, isv: string, score: Score, onPill: () => void,
}) => {
    const dictionaryLanguages = useDictionaryLanguages()
    const addLangs = ADD_LANGS.filter((lang) => dictionaryLanguages.includes(lang))
    const row = (lang: string) => {
        const str = Dictionary.getField(item.raw, lang)?.toString() || ''
        const machine = str[0] === '!'
        let text = machine ? str.slice(1) : str
        const closest = LANGS.includes(lang) && closestTranslation(isv, text, lang)
        if (closest) {
            const at = text.indexOf(closest.word)
            const several = text.replace(/\([^)]*\)/g, '').split(/[,;]/).length > 1
            const noVotes = band(score.answers, [lang]) === 'none'
            // raw HTML: the Table's {text}[class] markup takes no hyphens in a class name
            // the machine alone voted: its Lucide bot inside the pill, as on the card
            const bot = !score.votes[lang] && score.machine[lang] !== undefined ? BOT_SVG : ''
            const pill = `<span class="${PILL} ${band(score.answers, [lang])}">${bot}${
                noVotes ? '—' : pct(share(score.answers, [lang]) * 100)}</span>`
            // the closest word may be a variant not spelled as such in the cell: then the pill goes at the end
            text = at < 0 ? `${text} ${pill}` : `${text.slice(0, at)}${
                several ? `{${closest.word}}[B]` : closest.word} ${pill}${text.slice(at + closest.word.length)}`
        }

        return [`{${t(`${lang}Lang`)}}[B]@ts;b`, `${machine ? `${BOT_SVG} ` : ''}${text}@ts;tr;lang=${lang}`]
    }

    return (
    // the pills are the Table's HTML: one listener for all, a pill opens the intelligibility tab
         
        <div onClick={(e) => (e.target as Element).closest(`.${PILL}`) && onPill()}>
            <Table
                data={[
                    [`{${t('isvEtymologicLatinLang')}}[B]@ts;b;nowrap`, `${getLatin(item.isv, '2')}@ts;lang=isv-Latin`],
                    [`{${t('isvLatinLang')}}[B]@ts;b`, `${getLatin(item.isv, '3')}@ts;lang=isv-Latin`],
                    [`{${t('isvCyrillicLang')}}[B]@ts;b`, `${getCyrillic(item.isv, '3')}@ts;lang=isv-Cyrl`],
                    ['@w=2;S'],
                    row(EN),
                    ...LANGS.map(row),
                    ...(addLangs.length ? [['@w=2;S'], ...addLangs.map(row)] : []),
                ]}
            />
        </div>
    )
}

/** the card's pill, here around a language's code */
const PILL = 'results-card-status__pill'

/**
 * A rule closes the East (… uk) and the West (… sk); a fainter one Steenbergen's subgroups within them:
 * ru | be uk, pl | cs sk, sl hr sr | mk bg.
 */
const groupEnd = (lang: string) => (['uk', 'sk'].includes(lang) ? 'intelligibility-modal__group-end'
    : ['ru', 'pl', 'sr'].includes(lang) ? 'intelligibility-modal__subgroup-end' : undefined)


const pct = (n: number) => `${Math.round(n)}%`

/**
 * A share in percent as Steenbergen's votes out of 6, each rounded on its own to a tenth, halves up (¼ -> "0.3"; the
 * epsilon undoes float dust like 0.2499999): 79 -> "4.7", 16.7 -> "1.0". Rows may not add up exactly.
 */
const points = (percent: number) => (Math.round(percent * 6 / 10 + 1e-9) / 10).toFixed(1)
/** the points of a language nobody answered for: the score's ½ guess, muted, so the column still adds up */
const guess = (percent: number) => (
    <span className="intelligibility-modal__muted" title={t('intelligibilityGuess')}>({points(percent)})</span>
)

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
const SUB = '₀₁₂₃₄₅₆₇₈₉'
/** [1, 12] -> "¹⁄₁₂" */
const fraction = ([num, den]: [number, number]) => (num
    ? `${String(num).replace(/\d/g, (d) => SUP[d])}⁄${String(den).replace(/\d/g, (d) => SUB[d])}`
    : '0')

/** I_l, w_l, …: the columns read as the formula I = Σ w_l · I_l */
const Sym = ({ children }: { children: string }) => (
    <><i>{children[0]}</i><sub>{children.slice(1)}</sub></>
)

/**
 * Answer kinds as Lucide icons (ISC), the first three as on slovosbor's vote form: ThumbsUp, Meh, ThumbsDown,
 * then VenetianMask, Languages, Gem; the words go to the tooltip.
 * Inlined paths instead of lucide-react: the site needs only a few icons.
 */
/** a false friend is a warning: its numbers in red */
const falseFriend = (column?: string) => (column === 'FalseFriend' ? 'intelligibility-modal__false-friend' : '')

const COLUMNS: [string, string[]][] = [
    ['Yes', ['M7 10v12', 'M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8'
        + 'a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z']],
    ['Unsure', ['M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0', 'M8 15h8', 'M9 9h.01', 'M15 9h.01']],
    ['No', ['M17 14V2', 'M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8'
        + 'a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z']],
    ['FalseFriend', ['M18 11c-1.5 0-2.5.5-3 2', 'M4 6a2 2 0 0 0-2 2v4a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2'
        + ' 5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3a8 8 0 0 0-5 2 8 8 0 0 0-5-2z', 'M6 11c1.5 0 2.5.5 3 2']],
    ['OtherLanguage', ['m5 8 6 6', 'm4 14 6-6 2-3', 'M2 5h12', 'M7 2h1', 'm22 22-5-10-5 10', 'M14 18h6']],
    ['Rare', ['M10.5 3 8 9l4 13 4-13-2.5-6', 'M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 '
        + '1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z', 'M2 9h20']],
]

const Icon = ({ paths }: { paths: string[] }) => (
    <svg
        className="intelligibility-modal__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {paths.map((d) => <path key={d} d={d}/>)}
    </svg>
)

type Score = ReturnType<typeof lemmaScore>

/**
 * The score of one lemma, with the machine's votes and without them; the reasons (🎭 ⇄ 💎) per language.
 */
function useIntelligibility(item: ITranslateResult, index: number, isv: string) {
    return useMemo(() => {
        const votes = decodeVotes(item.intelligibility, index)
        const translationOf = (lang: string) => Dictionary.getField(item.raw, lang)?.toString() || ''
        const extras = Object.fromEntries(Object.entries(votes.six).map(([lang, counts]) => [lang, counts.slice(3)]))

        return {
            score: lemmaScore(votes),
            extras,
            translationOf,
        }
    }, [item, index, isv])
}

/** every answer of every language and the weights: I = Σ w_l · I_l */
/**
 * One table, two modes, the same rows: Interslavic in every script, English and the other languages, then the Slavic
 * ones with their share I_l. Translations: all their words. Match: each with its closest word, and the votes
 * behind the share. The header switches.
 */
const IntelligibilityTable = ({ isv, score, bot, extras, translationOf, lemmas, index, onLemma }: {
    isv: string, score: Score, bot: Score['machine'], extras: Record<string, number[]>,
    translationOf: (lang: string) => string,
    lemmas: string[], index: number, onLemma: (index: number) => void,
}) => {
    const flavorisation = useFlavorisationType()
    const alphabets = useAlphabets()
    // Interslavic in the reader's scripts only
    const scripts = [
        alphabets.latin && ['isv-Latin', t('isvLatinLang'), getLatin],
        alphabets.cyrillic && ['isv-Cyrl', t('isvCyrillicLang'), getCyrillic],
        alphabets.glagolitic && ['isv-Glag', t('isvLang'), getGlagolitic],
    ].filter(Boolean) as [string, string, (word: string, flavor: string) => string][]
    const { langs, votes, answers, parts, percent, ci, total } = score
    // the score's 😐 holds 💎 and its 👎 holds 🎭 and ⇄ (as slovosbor counts them): the table shows them apart
    const reasons = (lang: string, i: number) => {
        const [falseFriend = 0, otherLanguage = 0, rare = 0] = extras[lang] || []

        return i === 1 ? rare : i === 2 ? falseFriend + otherLanguage : 0
    }
    // people's answers in column i, the reasons in their own columns
    const own = (lang: string, i: number) => (i < 3
        ? (votes[lang]?.[i] || 0) - reasons(lang, i)
        : extras[lang]?.[i - 3] || 0)
    const cell = (lang: string, i: number) => (i < 3 ? answers[lang][i] - reasons(lang, i) : own(lang, i))
    // Σ: the row's answers, people and the machine alike
    const voters = (lang: string) => COLUMNS.reduce((n, _, i) => n + cell(lang, i), 0)
    // a sum of the machine's votes alone reads in italics, like the votes themselves
    const people = (lang: string) => COLUMNS.reduce((n, _, i) => n + own(lang, i), 0)
    const sum = (value: number, byPeople: number) => (value && !byPeople
        ? <i className="intelligibility-modal__machine" title={t('intelligibilityMachineVote')}>{value}</i>
        : value || '')
    const columnPeople = (i: number) => langs.reduce((n, lang) => n + own(lang, i), 0)
    // Interslavic sums up the Slavic languages: the score out of 6, every answer column, every voter
    const totals: ReactNode[] = [
        percent == null ? guess(total) : points(total),
        ...COLUMNS.map((_, i) => langs.reduce((n, lang) => n + cell(lang, i), 0)),
        langs.reduce((n, lang) => n + voters(lang), 0),
    ]

    return (
        <table className="intelligibility-modal__table">
            {(
                <thead>
                    <tr>
                        {/* the pills' head: Lucide "globe"; Match stands over the words */}
                        <th
                            className="intelligibility-modal__lang"
                            title={t('intelligibilityLanguage')}
                            aria-label={t('intelligibilityLanguage')}
                        >
                            <Icon paths={GLOBE}/>
                        </th>
                        <th title={t('intelligibilityMatchHint')}>{t('intelligibilityMatch')}</th>
                        {/* the numbers belong to the Match mode: I_l, w_l, the votes */}
                        <th title={t('intelligibilityShare')}><Sym>Iℓ</Sym></th>
                        {/* Jan van Steenbergen's six votes: the column links to where he describes them */}
                        <th className="intelligibility-modal__answer" title={t('intelligibilityContribution')}>
                            <a
                                className="intelligibility-modal__steen"
                                href="https://interslavic.fun/learn/misc/design-criteria#which-roots-to-use"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Flower answers={answers}/> <Sym>Sℓ</Sym>
                            </a>
                        </th>
                        {COLUMNS.map(([c, icon]) => (
                            <th
                                key={c}
                                className="intelligibility-modal__answer"
                                title={t(`intelligibility${c}`)}
                                aria-label={t(`intelligibility${c}`)}
                            >
                                <Icon paths={icon}/>
                            </th>
                        ))}
                        <th
                            className="intelligibility-modal__answer"
                            title={t('intelligibilitySum')}
                            aria-label={t('intelligibilitySum')}
                        >
                            Σ
                        </th>
                    </tr>
                </thead>
            )}
            <tbody>
                {langs.map((lang) => {
                    const noVotes = band(answers, [lang]) === 'none'

                    return (
                        <tr key={lang} className={groupEnd(lang)}>
                            {/* the language in its band's colour, its own cell: it stays while the rest scrolls */}
                            <th className="intelligibility-modal__lang">
                                <abbr className={`${PILL} ${band(answers, [lang])}`} title={t(`${lang}Lang`)}>
                                    {lang.toUpperCase()}
                                </abbr>
                            </th>
                            <th lang={lang}>
                                <Translation isv={isv} str={translationOf(lang)} lang={lang}/>
                            </th>
                            <td className="intelligibility-modal__answer intelligibility-modal__share">
                                {noVotes ? '—' : pct(share(answers, [lang]) * 100)}
                            </td>
                            {/* the language's points out of 6, S_l = 6 · w_l · I_l; its weight in the tooltip */}
                            <td
                                className="intelligibility-modal__answer"
                                title={`${t('intelligibilityWeight')}: ${fraction(parts[lang]?.fraction || [0, 1])
                                } → ≤ ${points(100 * (parts[lang]?.weight || 0))}`}
                            >
                                {/* no answer: the score counts the language at ½, a guess, not a point anyone gave */}
                                {noVotes ? guess(parts[lang]?.part || 0) : points(parts[lang]?.part || 0)}
                            </td>
                            {COLUMNS.map(([c], i) => (
                                <td key={c} className={`intelligibility-modal__answer ${falseFriend(c)}`}>
                                    {/* people's answers, or the machine's in italics where nobody answered */}
                                    {bot[lang] === i && !own(lang, i)
                                        ? (
                                            <i
                                                className="intelligibility-modal__machine"
                                                title={t('intelligibilityMachineVote')}
                                            >
                                                {cell(lang, i)}
                                            </i>
                                        )
                                        : cell(lang, i) || ''}
                                </td>
                            ))}
                            {/* everyone who answered for this language, the machine not counted */}
                            <td className="intelligibility-modal__answer">{sum(voters(lang), people(lang))}</td>
                        </tr>
                    )
                })}
            </tbody>
            {/* the total is Interslavic itself: the score, the lemma in the reader's scripts, every column summed */}
            <tfoot>
                {scripts.map(([lang, name, script], i) => (
                    <tr key={lang}>
                        <th className="intelligibility-modal__lang">
                            <abbr
                                className={`${PILL} ${percent == null ? 'none' : shareBand(total / 100)}`}
                                title={name}
                            >
                                ISV
                            </abbr>
                        </th>
                        <th lang={lang}>
                            {/* the synset's lemmas, this one in bold; a click on another steps to it, like ‹ › */}
                            {lemmas.map((lemma, n) => (
                                <span key={lemma}>
                                    {n ? ', ' : ''}
                                    {n === index ? (lemmas.length > 1 ? <b>{script(lemma, flavorisation)}</b>
                                        : script(lemma, flavorisation)) : (
                                        <button className="results-card-original__lemma" onClick={() => onLemma(n)}>
                                            {script(lemma, flavorisation)}
                                        </button>
                                    )}
                                </span>
                            ))}
                        </th>
                        {i === 0 && (
                            <td
                                rowSpan={scripts.length}
                                className="intelligibility-modal__answer intelligibility-modal__score"
                            >
                                {/* the flower by the score, where the eye goes first; its interval below */}
                                <span className="intelligibility-modal__nowrap">
                                    <Flower answers={answers}/> {percent == null ? '—' : `${percent}%`}
                                </span>
                                {percent != null && (
                                    <>
                                        {' '}
                                        <span
                                            className="intelligibility-modal__range"
                                            title={t('intelligibilityInterval')}
                                        >
                                            ({Math.round(ci[0])}–{pct(ci[1])})
                                        </span>
                                    </>
                                )}
                            </td>
                        )}
                        {i === 0 && totals.map((total, n) => (
                            <td
                                key={n}
                                rowSpan={scripts.length}
                                className={`intelligibility-modal__answer ${falseFriend(COLUMNS[n - 1]?.[0])}`}
                            >
                                {/* the six petals by the votes out of 6 */}
                                {n === 0 && <span className="intelligibility-modal__nowrap">
                                    <Flower answers={answers}/> {total}
                                </span>}
                                {n > 0 && sum(total as number, n <= COLUMNS.length
                                    ? columnPeople(n - 1) : langs.reduce((s, lang) => s + people(lang), 0))}
                            </td>
                        ))}
                    </tr>
                ))}
            </tfoot>
        </table>
    )
}

/** a lemma's tabs: its translations, what people understand, its forms when it has any */
type Tab = 'translations' | 'intelligibility' | 'forms'

/**
 * One lemma of a synset: the header names it (all enabled alphabets, a click copies one) and steps through the
 * synset's lemmas with ‹ ›. The tabs at the bottom: translations and intelligibility are one table in two modes, then
 * the forms.
 */
export const IntelligibilityModal = () => {
    const dispatch = useDispatch()
    const results = useResults()
    const modalDialog = useModalDialog()
    const alphabets = useAlphabets()
    const flavorisation = useFlavorisationType()
    const caseQuestions = useCaseQuestions()
    const item = results.find(({ id }) => id === modalDialog.data.id)
    const lemmas = splitLemmas(item?.isv || '')
    const [index, setIndex] = useState(Number(modalDialog.data.lemma) || 0)
    // the card's pill opens the votes, Declension the forms, the rest the translations
    const opened: Record<string, Tab> = { match: 'intelligibility', forms: 'forms' }
    const [tab, setTab] = useState<Tab>(opened[modalDialog.data.tab] || 'translations')
    const isv = lemmas[index] || lemmas[0] || ''
    const { score, extras, translationOf } = useIntelligibility(item || ({ raw: [] } as any), index, isv)

    const onClose = useCallback(() => {
        dispatch(hideModalDialog())
    }, [dispatch])
    const step = useCallback((by: number) => {
        setIndex((i) => Math.min(lemmas.length - 1, Math.max(0, i + by)))
    }, [lemmas.length])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                step(e.key === 'ArrowLeft' ? -1 : 1)
            }
        }
        window.addEventListener('keydown', onKey)

        return () => window.removeEventListener('keydown', onKey)
    }, [step])

    if (!item) {
        return null
    }

    const details = Dictionary.getField(item.raw, 'partOfSpeech')?.toString() || ''
    const add = Dictionary.getField(item.raw, 'addition')?.toString() || ''
    const hasForms = wordHasForms(item.original, item.details)
    const status = getWordStatus(item)
    const shownTab = hasForms || tab !== 'forms' ? tab : 'translations'
    const lines = scriptLines(item, alphabets, caseQuestions)
    // a line holds every lemma of the row ("zaimę, zaimennik"): this lemma's part when they split cleanly
    const lemmaOf = (str: string) => {
        const parts = str.split(', ')

        return parts.length === lemmas.length ? parts[index] : str
    }
    // the arrow's tooltip: the lemma it steps to and its score (the modal renders rarely: no memo)
    const neighbour = (i: number) => {
        const p = lemmaScore(decodeVotes(item.intelligibility, i)).percent

        return getLatin(lemmas[i], flavorisation) + (p == null ? '' : ` ${p}%`)
    }
    // ‹ before the word, › after it: the synset's previous and next lemma, round at both ends
    const arrow = (by: number) => {
        const to = (index + by + lemmas.length) % lemmas.length
        const label = neighbour(to)

        return (
            <button
                className="intelligibility-modal__step"
                title={label}
                aria-label={label}
                onClick={() => setIndex(to)}
            >
                <Icon paths={by < 0 ? ['m15 18-6-6 6-6'] : ['m9 18 6-6-6-6']}/>
            </button>
        )
    }

    return (
        <>
            <div className="modal-dialog__header">
                <div className="modal-dialog__header-title intelligibility-modal__summary">
                    <div className="intelligibility-modal__word">
                        {/* the card's own lines, cut to this lemma: "dlja (kogo? čego?) / дља (кого? чего?)" */}
                        {lemmas.length > 1 && arrow(-1)}
                        {lines.map(({ str, caseInfo, lang }, n) => (
                            <span key={lang}>
                                {n ? ' / ' : ''}
                                <Clipboard str={lemmaOf(str)} lang={lang}/>
                                {caseInfo && <span className="caseInfo"> ({caseInfo})</span>}
                            </span>
                        ))}
                        {!caseQuestions && item.caseInfo && (
                            <span className="caseInfo"> (+{t(`case${item.caseInfo.slice(1)}`)})</span>
                        )}
                        {lemmas.length > 1 && arrow(1)}
                    </div>
                    {/* what the lemma is: its part of speech in full */}
                    {details && (
                        <div className="intelligibility-modal__muted">
                            {expandAbbr(t, perLemma(details, lemmas.length > 1 ? index : 0))}
                        </div>
                    )}
                </div>
                <button className="modal-dialog__header-close" onClick={onClose} aria-label="Close">
                    &times;
                </button>
            </div>
            <div className="modal-dialog__body">
                {shownTab === 'translations' && (
                    <>
                        {/* the row's status, removed or new; intelligibility has its own tab */}
                        {status && status.icon !== '⚠️' && <div>{status.icon}&nbsp;{t(status.text)}</div>}
                        <TranslationsTable
                            item={item}
                            isv={isv}
                            score={score}
                            onPill={() => setTab('intelligibility')}
                        />
                    </>
                )}
                {shownTab === 'intelligibility' && (
                    <>
                        <div className="intelligibility-modal__scroll">
                            <IntelligibilityTable
                                isv={isv}
                                score={score}
                                bot={score.machine}
                                extras={extras}
                                translationOf={translationOf}
                                lemmas={lemmas.length ? lemmas : [isv]}
                                index={index}
                                onLemma={setIndex}
                            />
                        </div>
                    </>
                )}
                {shownTab === 'forms' && (
                    <DetailModal key={index} embedded lemma={index} word={item.isv} add={add} details={details}/>
                )}
            </div>
            {/* the tabs at the bottom, where the thumb is */}
            <footer className="modal-dialog__footer">
                <LineSelector
                    className="intelligibility-modal__tabs"
                    options={[
                        { name: t('translatesModalTitle'), value: 'translations' },
                        {
                            name: t('intelligibilityTitle'),
                            value: 'intelligibility',
                        },
                        ...(hasForms ? [{
                            name: getPartOfSpeech(item.details) === 'verb' ? t('conjugation') : t('declensions'),
                            value: 'forms',
                        }] : []),
                    ]}
                    value={shownTab}
                    onSelect={(value) => setTab(value as Tab)}
                />
            </footer>
        </>
    )
}
