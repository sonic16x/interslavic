import { isLoadingAction, runSearch, loadingProgressAction } from 'actions';
import { dataDelimiter, Dictionary } from 'services/dictionary';
import { biReporter } from 'services/biReporter';

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

export function fetchDictionary(dispatch): void {
    const startFidTime = performance.now();
    if (process.env.NODE_ENV !== 'production') {
        // tslint:disable-next-line
        console.time('FID');
    }
    fetch('data.txt')
        // .then(progressHelper(({loaded, total}) => {
        //     const p = Math.ceil((loaded / total) * 97);
        //     dispatch(loadingProgressAction(p));
        // }))
        .then((res) => res.text())
        .then((dataStr) => {
            const [wordListStr, searchIndexStr, percentsOfCheckedStr] = dataStr.split(dataDelimiter);
            const wordList = wordListStr
                .replace(/#/g, '')
                .split('\n')
                .map((l) => l.split('\t'));
            const searchIndex = {};
            const searchIndexObj = JSON.parse(searchIndexStr);
            for (const lang in searchIndexObj) {
                if (searchIndexObj.hasOwnProperty(lang)) {
                    searchIndex[lang] = searchIndexObj[lang];
                }
            }
            const percentsOfChecked = JSON.parse(percentsOfCheckedStr);
            const initTime = Dictionary.init(wordList, searchIndex, percentsOfChecked);
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
        });
}
