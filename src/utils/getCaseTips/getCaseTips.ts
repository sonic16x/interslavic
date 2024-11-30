export function getCaseTips(caseName: string, setName: string): string {
    switch(setName) {
        case 'noun': 
            switch(caseName[0]?.toUpperCase()) {
                case 'N': return 'kto? čto?'
                case 'A': return 'kogo? čto?'
                case 'G': return 'kogo? čego?'
                case 'D': return 'komu? čemu?'
                case 'I': return '(s) kym? (s) čim?'
                case 'L': return '(o) kom? (o) čem?'
                case 'V': return 'hej! ty! vy!'
                default: return ''
            }
        case 'nounShort': 
            switch(caseName[0]?.toUpperCase()) {
                case 'N': return 'kto? čto?'
                case 'A': return 'kogo? čto?'
                case 'G': return 'kogo? čego?'
                case 'D': return 'komu? čemu?'
                case 'I': return 'kym? čim?'
                case 'L': return 'kom? čem?'
                case 'V': return 'hej!'
                default: return ''
            }
        case 'adjectiveSingular': 
            switch(caseName[0]?.toUpperCase()) {
                case 'N': return 'kaky? kako? kaka?'
                case 'A': return 'kakogo? kako? kaku?'
                case 'G': return 'kakogo? kakoj?'
                case 'D': return 'kakomu? kakoj?'
                case 'I': return '(s) kakym? (s) kakoju?'
                case 'L': return '(o) kakom? (o) kakoj?'
                case 'V': return 'hej! ty! vy!'
                default: return ''
            }
        case 'adjectivePlural': 
            switch(caseName[0]?.toUpperCase()) {
                case 'N': return 'kaki? kake?'
                case 'A': return 'kakyh? kake?'
                case 'G': return 'kakyh?'
                case 'D': return 'kakym?'
                case 'I': return '(s) kakymi?'
                case 'L': return '(o) kakyh?'
                case 'V': return 'hej! ty! vy!'
                default: return ''
            }
        case 'adjective': 
            return `${getCaseTips(caseName,'adjectiveSingular')} ${getCaseTips(caseName,'adjectivePlural')}`
    }
    
    return ''
}
