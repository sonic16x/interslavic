export function markFluentVowel(word: string, add: string): string {
    let j = 0;
    for (let i = 0; i < Math.min(word.length - 1, add.length); i++) {
        if (word[i] === add[i]) {
            continue;
        } else if (word[i] !== add[i] && word[i + 1] === add[i]) {
            j = i;
            break;
        } else {
            break;
        }
    }
    if ( j === 0 ) {
        return word;
    }
    const fluentVowel = word[j].replace('è', 'e').replace('ò', 'o');

    return word.slice(0, j) + '(' + fluentVowel + ')' + word.slice(j + 1);
}
