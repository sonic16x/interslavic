import { isLoadingAction, runSearch } from 'actions';
import { dataDelimiter, Dictionary } from 'utils/dictionary';

export function fetchDictionary(dispatch) {
    const startFidTime = performance.now();
    if (process.env.NODE_ENV !== 'production') {
        // tslint:disable-next-line
        console.time('FID');
    }
    return fetch('data.txt')
        .then((res) => res.text())
        .then((dataStr) => {
            const [wordListStr, searchIndexStr, percentsOfCheckedStr] = dataStr.split(dataDelimiter);
            const wordList = wordListStr
                .replace(/#/g, '')
                .split('\n')
                .map((l) => l.split('\t'));
            const searchIndex = searchIndexStr
                .split('\n')
                .map((l) => {
                    const [key, forms] = l.split('\t');
                    return [key, forms.split('|')];
                });
            const percentsOfChecked = JSON.parse(percentsOfCheckedStr);
            Dictionary.init(wordList, searchIndex, percentsOfChecked);
            dispatch(isLoadingAction(false));
            dispatch(runSearch());

            const fidTime = Math.round(performance.now() - startFidTime); // @TODO: send to GA

            if (process.env.NODE_ENV !== 'production') {
                // tslint:disable-next-line
                console.log('FID', `${fidTime}ms`);
            }
        });
}
