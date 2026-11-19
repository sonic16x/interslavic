/**
 * Intelligibility of one lemma: slovosbor votes plus one machine vote per language (Levenshtein to its translation,
 * computed when the dictionary is built: see machineVote and the `intelligibility` column).
 * The card pill and the lemma window both read lemmaScore(), so their numbers agree.
 *
 * The share and the bands follow Slovosbor's intelligibility flower, so the numbers match its site.
 */
import { lemmaMark } from '../rankLemmas/rankLemmas'

/** [yes, unsure, no] */
export type Counts = [number, number, number]

/**
 * Weights of the languages in the score, they sum up to 1: three branches by 1/3; in the South sl + hr/sr and
 * bg + mk by 1/6. hr and sr are the two BCMS standards and halve their 1/12 whatever the votes;
 * bs and cnr are left out: Slovosbor has no votes in them yet.
 * NOTE: Slovosbor pools hr+sr+bs+cnr by votes instead, so its flower can differ for BCMS-heavy words.
 */
export const VOTE_BUCKETS: { weight: number; langs: string[] }[] = [
    { weight: 1 / 6, langs: ['ru'] },
    { weight: 1 / 12, langs: ['be'] },
    { weight: 1 / 12, langs: ['uk'] },
    { weight: 1 / 6, langs: ['pl'] },
    { weight: 1 / 12, langs: ['cs'] },
    { weight: 1 / 12, langs: ['sk'] },
    { weight: 1 / 12, langs: ['bg'] },
    { weight: 1 / 12, langs: ['mk'] },
    { weight: 1 / 12, langs: ['sl'] },
    { weight: 1 / 24, langs: ['hr'] },
    { weight: 1 / 24, langs: ['sr'] },
]

/** the languages of the votes, in the site's order: the positions of the `intelligibility` column */
export const VOTE_LANGS = ['ru', 'be', 'uk', 'pl', 'cs', 'sk', 'sl', 'hr', 'sr', 'mk', 'bg']

/** slovosbor's answers: yes, unsure, no, false friend, other language, rare */
export type Six = [number, number, number, number, number, number]

/** one lemma's answers: the people's six per language, and the machine's vote (0 yes, 1 unsure, 2 no) */
export interface ILemmaVotes {
    six: Record<string, Six>;
    machine: Record<string, number>;
}

/**
 * The `intelligibility` column of a dictionary row: lemmas in the order of the isv cell split by `|`,
 * VOTE_LANGS split by `,`, the six answers split by `.`, "+" on the answer the machine gave;
 * zeros and empty tails left out. ru: 5 yes (+ the machine's), 1 no; be: the machine's unsure -> "5+..1,.+"
 */
export function encodeVotes(lemmas: (ILemmaVotes | undefined)[]): string {
    return lemmas.map(({ six, machine } = { six: {}, machine: {} }) => VOTE_LANGS
        .map((lang) => Array.from({ length: 6 }, (_, i) => `${six[lang]?.[i] || ''}${machine[lang] === i ? '+' : ''}`)
            .join('.').replace(/\.+$/, ''))
        .join(',').replace(/,+$/, '')).join('|').replace(/\|+$/, '')
}

/** the answers of the index-th lemma of a row */
export function decodeVotes(column = '', index = 0): ILemmaVotes {
    const langs = (column.split('|')[index] || '').split(',')
    const votes: ILemmaVotes = { six: {}, machine: {} }
    VOTE_LANGS.forEach((lang, i) => {
        const fields = (langs[i] || '').split('.')
        const six = Array.from({ length: 6 }, (_, j) => parseInt(fields[j], 10) || 0) as Six
        const machine = fields.findIndex((field) => field.endsWith('+'))
        if (six.some(Boolean)) {
            votes.six[lang] = six
        }
        if (machine >= 0) {
            votes.machine[lang] = machine
        }
    })

    return votes
}

const MACHINE_VOTE: Record<string, number> = { '✅': 0, '⚠️': 1, '🚫': 2 }

/** the machine's answer for a lemma by Levenshtein to its translation ("!" marks a machine translation) */
export const machineVote = (lemma: string, translation: string, lang: string): number | undefined => (
    MACHINE_VOTE[lemmaMark(lemma, translation.replace(/^!/, ''), lang)]
)

/** (yes + ½·unsure) / (yes + unsure + no) over the languages, null without votes */
export function share(answers: Record<string, number[]>, langs: string[]): number | null {
    let score = 0
    let total = 0
    langs.forEach((lang) => {
        const [yes = 0, unsure = 0, no = 0] = answers[lang] || []
        score += yes + unsure / 2
        total += yes + unsure + no
    })

    return total ? score / total : null
}

export type Band = 'high' | 'partial' | 'low' | 'none'

/** the band of a share in 0–1: the same thresholds for a language, a petal and the whole score */
export const shareBand = (s: number | null): Band => (
    s == null ? 'none' : s >= 2 / 3 ? 'high' : s >= 1 / 3 ? 'partial' : 'low'
)

export function band(answers: Record<string, number[]>, langs: string[]): Band {
    return shareBand(share(answers, langs))
}

export const BAND_MARK: Record<Band, string> = { high: '✅', partial: '⚠️', low: '🚫', none: '' }

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a || 1)


export interface ILemmaScore {
    /** languages to show, in the site's order */
    langs: string[];
    /** people's votes */
    votes: Record<string, Counts>;
    /** the column of the machine vote per language: 0 yes, 1 unsure, 2 no */
    machine: Record<string, number>;
    /** people + machine */
    answers: Record<string, Counts>;
    /** weight of the language in the score and its contribution, both in %; contributions sum up to `total` */
    parts: Record<string, { weight: number; part: number; fraction: [number, number] }>;
    total: number;
    /** Math.round(total), null when neither people nor the machine voted */
    percent: number | null;
    /** 95 % interval of `total`, in % */
    ci: [number, number];
    /** number of people's votes */
    people: number;
}

/**
 * A bucket with several languages splits its weight by votes; a bucket without any vote counts as ½
 * (slovosbor shows the midpoint of "nobody understands" and "everybody understands")
 * and splits its weight evenly among the shown languages.
 */
export function lemmaScore({ six, machine }: ILemmaVotes): ILemmaScore {
    // as slovosbor's flower: a false friend and another language are a "no", a rare word an "unsure"
    const votes: Record<string, Counts> = Object.fromEntries(Object.entries(six)
        .map(([lang, [y, u, no, ff, ol, rare]]) => [lang, [y, u + rare, no + ff + ol]]))
    const langs = VOTE_LANGS
    const answers: Record<string, Counts> = {}
    langs.forEach((lang) => {
        const counts = [...(votes[lang] || [0, 0, 0])] as Counts
        if (machine[lang] !== undefined) {
            counts[machine[lang]] += 1
        }
        answers[lang] = counts
    })

    const parts: ILemmaScore['parts'] = {}
    VOTE_BUCKETS.forEach(({ weight, langs: bucket }) => {
        const counts = bucket.map((lang) => answers[lang] || [0, 0, 0])
        const total = counts.reduce((n, [y, u, no]) => n + y + u + no, 0)
        const present = bucket.filter((lang) => langs.includes(lang))
        bucket.forEach((lang, i) => {
            const [y, u, no] = counts[i]
            const w = total ? weight * (y + u + no) / total : (present.includes(lang) ? weight / present.length : 0)
            // the same weight as an exact fraction: 1/12 of a bucket, 3 of its 5 votes -> 1/20
            const den = Math.round(1 / weight) * (total || present.length || 1)
            const num = total ? y + u + no : (present.includes(lang) ? 1 : 0)
            const g = gcd(num, den)
            parts[lang] = {
                weight: w * 100,
                part: (total ? weight * (y + u / 2) / total : w / 2) * 100,
                fraction: [num / g, den / g],
            }
        })
    })

    const total = langs.reduce((n, lang) => n + (parts[lang]?.part || 0), 0)
    const people = Object.values(votes).reduce((n, [y, u, no]) => n + y + u + no, 0)
    const anyVote = people > 0 || Object.keys(machine).length > 0

    // NOTE: normal approximation of a weighted sum of proportions; Agresti smoothing (+1/+2) keeps one vote from
    // reading as certainty; a language without votes is uniform on [0, 1] (variance 1/12). Bootstrap if it misleads.
    const variance = langs.reduce((v, lang) => {
        const w = (parts[lang]?.weight || 0) / 100
        const [y, u, no] = answers[lang]
        const n = y + u + no
        const p = (y + u / 2 + 1) / (n + 2)

        return v + w * w * (n ? p * (1 - p) / (n + 2) : 1 / 12)
    }, 0)
    const half = 1.96 * Math.sqrt(variance) * 100
    const ci: [number, number] = [Math.max(0, total - half), Math.min(100, total + half)]

    return { langs, votes, machine, answers, parts, total, percent: anyVote ? Math.round(total) : null, ci, people }
}
