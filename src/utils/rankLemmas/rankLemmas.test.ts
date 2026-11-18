import { closestTranslation, lemmaDistance, lemmaMark, rankLemmas } from './rankLemmas'

describe('rankLemmas', () => {
    it('puts the lemma closest to the reader\'s translation first', () => {
        expect(rankLemmas(['avto', 'avtomobil'], 'автомобиль, машина', 'ru')).toEqual([1, 0])
    })

    it('keeps the row order for ties and for unsupported languages', () => {
        expect(rankLemmas(['avto', 'avtomobil'], 'automobile', 'en')).toEqual([0, 1])
        expect(rankLemmas(['za', 'dlja'], '', 'ru')).toEqual([0, 1])
    })

    it('ignores brackets and multiword variants', () => {
        expect(lemmaDistance('voda', 'вода (ж.), жидкость для питья', 'ru')).toBe(0)
        expect(lemmaDistance('voda', 'жидкость для питья', 'ru')).toBeNull()
    })
})

describe('closestTranslation', () => {
    it('names the cognate among the variants', () => {
        expect(closestTranslation('zaimennik', 'местоимение (грам.)', 'ru')?.word).toBe('местоимение')
        expect(closestTranslation('kot', 'en-only', 'en')).toBeNull()
    })
})

describe('lemmaMark', () => {
    it('warns by distance to the closest translation', () => {
        expect(lemmaMark('zaimennik', 'займенник', 'uk')).toBe('✅')
        expect(lemmaMark('zaimennik', 'местоимение (грам.)', 'ru')).toBe('🚫')
        expect(lemmaMark('zaimennik', 'pronoun', 'en')).toBe('')
    })
})
