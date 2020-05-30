import { isLoadingAction, runSearch, loadingProgressAction } from 'actions';
import { dataDelimiter, Dictionary } from 'services/dictionary';
import { biReporter } from 'services/biReporter';
import { addLangs } from 'consts';

function progressHelper(onProgress) {
    return (response) => {
        if (!response.body) {
            return response;
        }

        let loaded = 0;
        const contentLength = response.headers.get('content-length');
        const total = !contentLength ? -1 : parseInt(contentLength, 10);

        return new Response(
            new ReadableStream({
                start(controller) {
                    const reader = response.body.getReader();
                    return read();

                    function read() {
                        return reader.read()
                            .then(({ done, value }) => {
                                if (done) {
                                    return void controller.close();
                                }
                                loaded += value.byteLength;
                                onProgress({ loaded, total });
                                controller.enqueue(value);
                                return read();
                            })
                            .catch((error) => {
                                controller.error(error);
                            });
                    }
                },
            }),
        );
    };
}

async function fetchStat() {
    return fetch('data/translateStatistic.json').then((res) => res.json()).then((data) => data);
}

async function fetchLangs(langList: string[]) {
    return await Promise
        .all(langList.map((lang) => fetch(`data/${lang}.txt`)
        .then((res) => res.text())))
        .then((rawResults) => {
            return rawResults.map((rawLangData) => {
                const [wordListStr, searchIndexStr] = rawLangData.split(dataDelimiter);

                return {
                    wordList: wordListStr.split('\n'),
                    searchIndex: JSON.parse(searchIndexStr),
                };
            });
        });
}

async function fetchBasic() {
    return await fetch('data/basic.txt')
        .then((res) => res.text())
        .then((dataStr) => {
            const [wordListStr, searchIndexStr] = dataStr.split(dataDelimiter);
            const wordList: string[][] = wordListStr
                .replace(/#/g, '')
                .split('\n')
                .map((l) => l.split('|'));

            return { wordList, searchIndex: JSON.parse(searchIndexStr) };
        });
}

export async function fetchLang(lang) {
    if (Dictionary.hasLang(lang)) {
        return;
    }

    const [{ wordList, searchIndex }] = await fetchLangs([lang]);

    Dictionary.addLang(wordList, searchIndex);
}

export async function fetchDictionary(dispatch, langList: string[]) {
    const stat = await fetchStat();
    const basicData = await fetchBasic();
    const langsData = await fetchLangs(langList.filter((lang) => addLangs.includes(lang)));

    const startFidTime = performance.now();

    if (process.env.NODE_ENV !== 'production') {
        // tslint:disable-next-line
        console.time('FID');
    }

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
        // tslint:disable-next-line
        console.log('FID', `${fidTime}ms`);
    }
}
