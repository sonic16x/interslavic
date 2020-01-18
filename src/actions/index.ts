import { Dictionary, dataDelimiter } from 'utils/dictionary';
import { setLang } from 'translations';

export enum ActionTypes {
    LANG = 'LANG',
    FROM_TEXT = 'FROM_TEXT',
    SEARCH_TYPE = 'SEARCH_TYPE',
    FLAVORISATION_TYPE = 'FLAVORISATION_TYPE',
    SET_PAGE = 'SET_PAGE',
    SET_INTERFACE_LANG = 'SET_INTERFACE_LANG',
    IS_LOADING = 'IS_LOADING',
    LOADING_PROGRESS = 'LOADING_PROGRESS',
    SET_DETAIL = 'SET_DETAIL',
    DETAIL_IS_VISIBLE = 'DETAIL_IS_VISIBLE',
    SET_SEARCH_EXPAND = 'SET_SEARCH_EXPAND',
    ALPHABET_TYPE = 'ALPHABET_TYPE',
    RUN_SEARCH = 'RUN_SEARCH',
}

export function langAction(data: {from: string, to: string}) {
    return {
        type: ActionTypes.LANG,
        data,
    };
}

export function setDetailAction(data: number) {
    return {
        type: ActionTypes.SET_DETAIL,
        data,
    };
}

export function showDetailAction() {
    return {
        type: ActionTypes.DETAIL_IS_VISIBLE,
        data: true,
    };
}

export function setAlphabetTypeAction(data: number) {
    return {
        type: ActionTypes.ALPHABET_TYPE,
        data,
    };
}

export function hideDetailAction() {
    return {
        type: ActionTypes.DETAIL_IS_VISIBLE,
        data: false,
    };
}

export function setSearchExpand(data) {
    return {
        type: ActionTypes.SET_SEARCH_EXPAND,
        data,
    };
}

export function fromTextAction(data: string) {
    return {
        type: ActionTypes.FROM_TEXT,
        data,
    };
}

export function searchTypeAction(data: string) {
    return {
        type: ActionTypes.SEARCH_TYPE,
        data,
    };
}

export function flavorisationTypeAction(data: string) {
    return {
        type: ActionTypes.FLAVORISATION_TYPE,
        data,
    };
}

export function setPageAction(data: string) {
    return {
        type: ActionTypes.SET_PAGE,
        data,
    };
}

export function isLoadingAction(data: boolean) {
    return {
        type: ActionTypes.IS_LOADING,
        data,
    };
}

export function loadingProgressAction(data: number) {
    return {
        type: ActionTypes.LOADING_PROGRESS,
        data,
    };
}

export function setInterfaceLang(data: string) {
    setLang(data);
    return {
        type: ActionTypes.SET_INTERFACE_LANG,
        data,
    };
}

export function runSearch() {
    return {
        type: ActionTypes.RUN_SEARCH,
    };
}

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

export function fetchDictionary(dispatch) {
    if (process.env.NODE_ENV !== 'production') {
        // tslint:disable-next-line
        console.time('FID');
    }
    return fetch('data.txt')
        .then(progressHelper(({loaded, total}) => {
            const p = Math.ceil((loaded / total) * 100);
            dispatch(loadingProgressAction(p));
        }))
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
            if (process.env.NODE_ENV !== 'production') {
                // tslint:disable-next-line
                console.timeEnd('FID');
            }
        });
}
