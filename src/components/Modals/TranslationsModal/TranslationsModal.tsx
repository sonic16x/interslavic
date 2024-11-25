import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { addLangs, langs } from 'consts';

import { t } from 'translations';

import { hideModalDialog } from 'actions';

import { Dictionary } from 'services/dictionary';

import { useDictionaryLanguages } from 'hooks/useDictionaryLanguages';
import { useInterfaceLang } from 'hooks/useInterfaceLang';
import { useModalDialog } from 'hooks/useModalDialog';
import { useResults } from 'hooks/useResults';
import { getCyrillic } from 'utils/getCyrillic';
import { getLatin } from 'utils/getLatin';
import { getWordStatus } from "utils/getWordStatus";
import { findIntelligibilityIssues } from "utils/intelligibilityIssues";

import { Table } from 'components/Table';

import './TranslationsModal.scss';

function renderTranslate(str: string): string {
    if (str && str[0] === '!') {
        return `🤖 {${str.slice(1)}}[s]@ts;`;
    }

    return `${str}@ts`;
}

export const TranslationsModal =
    () => {
        const results = useResults();
        const dispatch = useDispatch();
        const modalDialog = useModalDialog();
        const dictionaryLanguages = useDictionaryLanguages();
        useInterfaceLang();

        const item = results[modalDialog.data.index];

        const onClick = useCallback(() => {
            dispatch(hideModalDialog());
        }, [dispatch]);

        if (!item) {
            return null;
        }

        const addLangsFiltered = addLangs.filter((lang) => dictionaryLanguages.includes(lang));

        const allLangs = [
            'isv',
            'en',
            ...langs,
            ...addLangsFiltered,
        ];

        const intelligibility = Dictionary.getField(item.raw, 'intelligibility');
        const marks = findIntelligibilityIssues(intelligibility);
        const tableData = allLangs.reduce((arr, lang) => {
            const translate = Dictionary.getField(item.raw, lang).toString();

            if (lang === 'isv') {
                return [
                    [
                        `{${t('isvEtymologicLatinLang')}}[B]@ts;b;sw=130px;nowrap`,
                        `${getLatin(item.isv, '2')}@ts`,
                    ],
                    [
                        `{${t('isvLatinLang')}}[B]@ts;b`,
                        `${getLatin(item.isv, '3')}@ts`,
                    ],
                    [
                        `{${t('isvCyrillicLang')}}[B]@ts;b`,
                        `${getCyrillic(item.isv, '3')}@ts`,
                    ],
                    [
                        `@w=2;S`,
                    ],
                ];
            }

            return [
                ...arr,
                [
                    `{${marks[lang] || ''} ${t(`${lang}Lang`)}}[B]@ts;b`,
                    renderTranslate(translate),
                ],
                (
                    (lang === 'bg' && addLangsFiltered.length) ? (
                        [
                            `@w=2;S`,
                        ]
                    ) : ([])
                ),
            ];
        }, []);

        const hasMarks = new Set(Object.values(marks).filter(Boolean)).size > 0;
        const wordStatus = getWordStatus(item)
        const extraLegend = hasMarks && (<>
            <br/>
                ⚠️ – {t('translationsLegendIntelligibilityWarning')}.<br/>
                🚫 – {t('translationsLegendIntelligibilityNone')}.<br/>
        </>);

        return (
            <>
                <div className="modal-dialog__header">
                    <div className="modal-dialog__header-title">
                        {t('translatesModalTitle')}
                    </div>
                    <button
                        className="modal-dialog__header-close"
                        onClick={onClick}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                <div className="modal-dialog__body">
                    {wordStatus && (
                        <div>
                            {wordStatus.icon}&nbsp;{t(wordStatus.text)}
                        </div>
                    )}
                    <Table data={tableData}/>
                </div>
                <footer className="modal-dialog__footer">
                    <div className="modal-legend">
                        🤖 – {t('translationsLegendMachineTranslations')}.
                        {extraLegend}
                    </div>
                </footer>
            </>
        );
    };
