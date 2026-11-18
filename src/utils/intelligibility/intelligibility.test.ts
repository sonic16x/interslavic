import { decodeVotes, encodeVotes, ILemmaVotes, lemmaScore, machineVote } from './intelligibility'

// the column's positions: ru be uk pl cs sk sl hr sr mk bg
describe('lemmaScore', () => {
    it('sums the contributions up to the score; a language without votes counts as half its weight', () => {
        const { parts, total, percent, people, ci } = lemmaScore(decodeVotes('1.2,,,2,,,,1,..1'))

        expect(people).toBe(7)
        expect(Object.values(parts).reduce((n, p) => n + p.part, 0)).toBeCloseTo(total)
        expect(percent).toBe(Math.round(total))
        // ru: (1 + 2/2) / 3 of 1/6
        expect(parts.ru.part).toBeCloseTo(100 / 6 * 2 / 3)
        // be: no votes, no translation -> half of 1/12
        expect(parts.be.part).toBeCloseTo(100 / 12 / 2)
        // hr and sr: 1/24 each whatever the votes; hr 1 yes, sr 1 no
        expect(parts.hr.part).toBeCloseTo(100 / 24)
        expect(parts.sr.part).toBeCloseTo(0)
        // the interval holds the score and stays in 0–100
        expect(ci[0]).toBeLessThanOrEqual(total)
        expect(ci[1]).toBeGreaterThanOrEqual(total)
        expect(ci[0]).toBeGreaterThanOrEqual(0)
        expect(ci[1]).toBeLessThanOrEqual(100)
        // weights as exact fractions
        expect(parts.ru.fraction).toEqual([1, 6])
        expect(parts.be.fraction).toEqual([1, 12])
        expect(parts.hr.fraction).toEqual([1, 24])
    })

    it('adds the machine\'s vote to the people\'s, a language without votes gets it alone', () => {
        // ru: 1 yes + the machine's yes; uk: the machine's yes only
        const { machine, answers, votes } = lemmaScore(decodeVotes('1+,,+'))

        expect(answers.ru).toEqual([2, 0, 0])

        expect(votes.uk).toBeUndefined()
        expect(machine.uk).toBe(0)
        expect(answers.uk).toEqual([1, 0, 0])
    })

    it('counts a false friend and another language as "no", a rare word as "unsure", as slovosbor does', () => {
        const { votes } = lemmaScore({ six: { pl: [1, 0, 0, 2, 1, 3] }, machine: {} })

        expect(votes.pl).toEqual([1, 3, 3])
    })

    it('gives no score when neither people nor the machine voted', () => {
        expect(lemmaScore(decodeVotes('')).percent).toBeNull()
    })
})

describe('the intelligibility column', () => {
    it('keeps each lemma\'s six answers and the machine\'s vote per language through encode and decode', () => {
        const lemmas: ILemmaVotes[] = [
            { six: { ru: [5, 0, 1, 0, 0, 0] }, machine: { ru: 0, be: 1 } },
            { six: {}, machine: {} },
            { six: { pl: [0, 0, 0, 1, 2, 3], bg: [1, 0, 0, 0, 0, 0] }, machine: { bg: 2 } },
        ]
        const column = encodeVotes(lemmas)

        expect(column).toBe('5+..1,.+||,,,...1.2.3,,,,,,,1..+')
        lemmas.forEach((votes, i) => expect(decodeVotes(column, i)).toEqual(votes))
    })

    it('lets the machine vote by Levenshtein to the translation, a machine translation\'s "!" ignored', () => {
        expect(machineVote('zaimennik', 'займенник', 'uk')).toBe(0)
        expect(machineVote('zaimennik', '!займенник', 'uk')).toBe(0)
        expect(machineVote('zaimennik', '', 'uk')).toBeUndefined()
    })
})
