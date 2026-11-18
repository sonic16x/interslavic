import { addVotes } from './slovosborVotes'

describe('addVotes', () => {
    it('marks every language of a voted row, senses summed; other rows keep the sheet\'s marks', () => {
        const tsv = [
            'steen_id\tsense_uri\tisv\ten_definition\tlang\tyes\tdunno\tno\tfalse_friend\tother_language\trare\ttotal',
            '7\tlemma:isv/uško.n.1#a\tuško\tear\tru\t1\t0\t0\t1\t0\t0\t2',
            '7\tlemma:isv/uško.n.2#a\tuško\tlug\tru\t2\t0\t0\t0\t0\t1\t3',
            '7\tlemma:isv/uho.n.1#a\tuho\tear\tpl\t0\t0\t1\t1\t0\t0\t2',
            '7\tlemma:isv/uho.n.1#a\tuho\tear\tbs\t1\t0\t0\t0\t0\t0\t1',
            '8\tlemma:isv/nos.n.1#a\tnos\tnose\tru\t0\t0\t0\t0\t0\t0\t0',
        ].join('\n')
        const wordList = [['id', 'isv', 'intelligibility'], ['7', 'uho, uško', 'be+ ru+'], ['8', 'nos', 'ru+ pl+']]

        expect(addVotes(wordList, tsv)).toBe(1)
        // ru: (3 + ½·1) / 5 = 0.7; pl: nobody understands; bs is not a language of the marks; no answers: "?"
        expect(wordList[1][2]).toBe('ru+ be? uk? pl- cs? sk? sl? hr? sr? mk? bg?')
        // nos: listed, but nobody answered
        expect(wordList[2][2]).toBe('ru+ pl+')
    })
})
