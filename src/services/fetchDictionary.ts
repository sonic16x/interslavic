import { addLangs } from 'consts';

import { isLoadingAction, runSearch } from 'actions';

import { biReporter } from 'services/biReporter';
import { Dictionary } from 'services/dictionary';

// function progressHelper(onProgress) {
//     return (response) => {
//         if (!response.body) {
//             return response;
//         }
//
//         let loaded = 0;
//         const contentLength = response.headers.get('content-length');
//         const total = !contentLength ? -1 : parseInt(contentLength, 10);
//
//         return new Response(
//             new ReadableStream({
//                 start(controller) {
//                     const reader = response.body.getReader();
//                     return read();
//
//                     function read() {
//                         return reader.read()
//                             .then(({ done, value }) => {
//                                 if (done) {
//                                     return void controller.close();
//                                 }
//                                 loaded += value.byteLength;
//                                 onProgress({ loaded, total });
//                                 controller.enqueue(value);
//                                 return read();
//                             })
//                             .catch((error) => {
//                                 controller.error(error);
//                             });
//                     }
//                 },
//             }),
//         );
//     };
// }

async function fetchStat() {
    return fetch('data/translateStatistic.json').then((res) => res.json()).then((data) => data);
}

async function fetchLangs(langList: string[]) {
    return await Promise.all(
        langList.map((lang) => fetch(`data/${lang}.json`).then((res) => res.json()))
    );
}

async function fetchBasic() {
    return await fetch('data/basic.json').then((res) => res.json());
}

export async function fetchLang(lang) {
    if (Dictionary.hasLang(lang)) {
        return;
    }

    const [{ wordList, searchIndex }] = await fetchLangs([lang]);

    Dictionary.addLang(wordList, searchIndex);
}

export async function fetchDictionary(dispatch, langList: string[]) {
    const startFidTime = performance.now();

    const stat = await fetchStat();
    const basicData = await fetchBasic();
    const langsData = await fetchLangs(langList.filter((lang) => addLangs.includes(lang)));

    langsData.forEach((langData) => {
        basicData.searchIndex = {
            ...basicData.searchIndex,
            ...langData.searchIndex,
        };
        langData.wordList.forEach((langField, i) => {
            basicData.wordList[i].push(langField);
        });
    });

    const initTime = Dictionary.init(basicData.wordList, basicData.searchIndex, stat);

    // dispatch(loadingProgressAction(100));
    dispatch(isLoadingAction(false));
    dispatch(runSearch());

    const fidTime = Math.round(performance.now() - startFidTime);

    biReporter.performanceInit(initTime);
    biReporter.performanceFID(fidTime);

    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('FID', `${fidTime}ms`);
    }
}
