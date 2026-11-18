import { getVerbDetails } from 'utils'

test('getVerbDetails', () => {
    expect(getVerbDetails('v.tr. ipf./pf.')).toEqual(['transitive', 'imperfectiveOrPerfective', 'main'])
    expect(getVerbDetails('v.tr./intr. pf.')).toEqual(['transitive', 'intransitive', 'perfective', 'main'])
    expect(getVerbDetails('v.aux. ipf.')).toEqual(['auxiliar', 'imperfective'])
})
