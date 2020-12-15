import { hideModalDialog } from 'actions';
import Table from 'components/Table';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { t } from 'translations';
import './index.scss';
import { langs } from 'consts';
import { validFields } from 'services/dictionary';
import { getLatin } from 'utils/getLatin';
import { getCyrillic } from 'utils/getCyrillic';
import { useResults } from 'hooks/useResults';
import { useInterfaceLang } from 'hooks/useInterfaceLang';
import { useModalDialog } from 'hooks/useModalDialog';

function renderTranslate(str: string): string {
    if (str[0] === '!') {
        return `{${str.slice(1)}}[s]@ts;`;
    }
    return `{✓}[g] ${str}@ts`;
}

export const TranslationsModal: React.FC =
    () => {
        const results = useResults();
        const dispatch = useDispatch();
        const modalDialog = useModalDialog();
        useInterfaceLang();

        const item = results[modalDialog.index];

        const onClick = React.useCallback(() => {
            dispatch(hideModalDialog());
        }, [dispatch]);

        if (!item) {
            return null;
        }

        const allLangs = [
            'isv',
            'en',
            ...langs,
        ];

    // '&#64;' is HTML escaped code for '@', which breaks table otherwise.
    // Why '&#64;' instead of '&commat;'?
    // Because getCyrillic transforms it into '&цоммат;'
        item.raw = item.raw.map((item) => (item.replace(/@/g, '&#64;')));

        const translates = item.raw.filter((_, i) => (allLangs.includes(validFields[i])));
        const tableData = allLangs.reduce((arr, lang, i) => {
            if (lang === 'isv') {
                return [
                    [
                        `{${t('isvEtymologicLatinLang')}}[B]@ts;b;sw=130px;nowrap`,
                        `${getLatin(translates[i], '2')}@ts`,
                    ],
                    [
                        `{${t('isvLatinLang')}}[B]@ts;b`,
                        `${getLatin(translates[i], '3')}@ts`,
                    ],
                    [
                        `{${t('isvCyrillicLang')}}[B]@ts;b`,
                        `${getCyrillic(translates[i], '3')}@ts`,
                    ],
                    [
                        `@w=2;S`,
                    ],
                ];
            }

            return [
                ...arr,
                [
                    `{${t(`${lang}Lang`)}}[B]@ts;b`,
                    renderTranslate(translates[i]),
                ],
            ];
        }, []);

        return (
            <>
                <div className={'modal-dialog__header'}>
                    <div className={'modal-dialog__header-title'}>
                        {t('translatesModalTitle')}
                    </div>
                    <button
                        className={'modal-dialog__header-close'}
                        onClick={onClick}
                        aria-label={'Close'}
                    >
                        &times;
                    </button>
                </div>
                <div className={'modal-dialog__body'}>
                    <Table data={tableData}/>
                </div>
                <footer className={'modal-dialog__footer'}>
                    {t('translationsBottomText')}
                    <br/>
                    {t('aboutJoinText')}
                </footer>
            </>
        );
    };
