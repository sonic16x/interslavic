import { decodeVotes } from 'utils'

import { addVotes, keepDeployedVotes } from './slovosborVotes'

describe('addVotes', () => {
    it('puts the export\'s votes on their lemma\'s place in the row, senses summed', () => {
        const tsv = [
            'steen_id\tsense_uri\tisv\ten_definition\tlang\tyes\tdunno\tno\tfalse_friend\tother_language\trare\ttotal',
            '7\tlemma:isv/uško.n.1#a\tuško\tear\tru\t1\t0\t0\t1\t0\t0\t2',
            '7\tlemma:isv/uško.n.2#a\tuško\tlug\tru\t2\t0\t0\t0\t0\t1\t3',
            '7\tlemma:isv/uho.n.1#a\tuho\tear\tbs\t1\t0\t0\t0\t0\t0\t1',
            '8\tlemma:isv/nos.n.1#a\tnos\tnose\tpl\t1\t0\t0\t0\t0\t0\t1',
        ].join('\n')
        const wordList = [['id', 'isv', 'intelligibility', 'ru'], ['7', 'uho, uško', 'be+ ru+', 'ухо, ушко']]

        expect(addVotes(wordList, tsv)).toEqual({ matched: 1, unmatched: 1 })
        // uho: bs is not a vote language, the machine's yes only; uško: both senses of ru; the old marks are gone
        expect(decodeVotes(wordList[1][2], 0)).toEqual({ six: {}, machine: { ru: 0 } })
        // people answered ru for uško: the machine does not vote there
        expect(decodeVotes(wordList[1][2], 1)).toEqual({ six: { ru: [3, 0, 0, 1, 0, 1] }, machine: {} })
    })
})

describe('keepDeployedVotes', () => {
    it('keeps the deployed votes by row id, never the sheet\'s old marks', () => {
        const wordList = [['id', 'intelligibility'], ['7', 'be+ ru+'], ['8', ''], ['9', 'x']]
        const deployed = [['intelligibility', 'id'], ['3+,1', '7'], ['be+ ru~', '8']]

        expect(keepDeployedVotes(wordList, deployed)).toBe(1)
        expect(wordList.slice(1).map((row) => row[1])).toEqual(['3+,1', '', ''])
    })
})
