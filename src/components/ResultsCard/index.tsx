import * as React from 'react';
import { useDispatch } from 'react-redux';
import { t } from 'translations';
import './index.scss';
import { Dictionary, ITranslateResult } from 'utils/dictionary';
import { getPartOfSpeech } from 'utils/wordDetails';
import classNames from 'classnames';
import { IAlphabets, ILang, MODAL_DIALOG_TYPES } from 'reducers';
import { Clipboard } from 'components/Clipboard';
import { setFavoriteAction, showModalDialog } from 'actions';
import biReporter from 'utils/biReporter';

interface IResultsCardProps {
    item: ITranslateResult;
    alphabets: IAlphabets;
    lang: ILang;
    index: number;
    isFavorite: boolean;
}

function showFormsButtonIsVisible(item: ITranslateResult) {
    const pos = getPartOfSpeech(item.details);

    switch (pos) {
        case 'noun':
        case 'numeral':
        case 'pronoun':
            if (item.original.includes(' ') && item.original.match(/[^,] [^\[]/)) {
                return false;
            }
        case 'adjective':
        case 'verb':
            return true;
        default:
            return false;
    }
}

function renderOriginal(item, alphabets, index) {
    let latin = item.original;
    if (item.add) {
        latin += ` ${item.add}`;
    }

    let cyrillic = item.originalCyr;
    if (item.addCyr) {
        cyrillic += ` ${item.addCyr}`;
    }

    let gla = item.originalGla;
    if (item.addGla) {
        gla += ` ${item.addGla}`;
    }

    const result = [];

    if (alphabets.latin) {
        result.push({
            str: latin,
            lang: 'isv-Latin',
        });
    }

    if (alphabets.cyrillic) {
        result.push({
            str: cyrillic,
            lang: 'isv-Cyrl',
        });
    }

    if (alphabets.glagolitic) {
        result.push({
            str: gla,
            lang: 'isv-Glag',
        });
    }

    return (
        <>
            {result.map(({str, lang}, i) => {
                return (
                    <Clipboard
                        className={'word'}
                        key={i}
                        str={str}
                        index={index}
                        item={item}
                        type={'card'}
                        lang={lang}
                    />
                );
            })}&nbsp;{item.ipa && <span className={'ipa'}>[{item.ipa}]</span>}
        </>
    );
}

export const ResultsCard: React.FC<IResultsCardProps> =
    ({item, alphabets, lang, isFavorite, index}: IResultsCardProps) => {
        const id = Dictionary.getField(item.raw, 'id').toString();
        const pos = getPartOfSpeech(item.details);
        const dispatch = useDispatch();
        const cardBiInfo = {
            wordId: id,
            isv: item.raw[0],
            index,
        };

        const reportClick = React.useCallback(() => {
            biReporter.cardInteraction('click card', cardBiInfo);
        }, [id, index]);
        const showTranslations = React.useCallback(() => {
            biReporter.cardInteraction('show forms', cardBiInfo);
            dispatch(showModalDialog({
                type: MODAL_DIALOG_TYPES.MODAL_DIALOG_TRANSLATION,
                index,
            }));
        }, [index]);
        const showDetail = React.useCallback(() => {
            biReporter.cardInteraction('show translations', cardBiInfo);
            dispatch(showModalDialog({
                type: MODAL_DIALOG_TYPES.MODAL_DIALOG_WORD_FORMS,
                index,
            }));
        }, [index]);
        const setFavorite = React.useCallback(() => {
            dispatch(setFavoriteAction(id));
        }, [id]);

        return (
            <div className={'results-card'} tabIndex={0} onClick={reportClick}>
                <div className={'results-card__translate'}>
                    {lang.from !== 'isv' ? (
                        <Clipboard
                            str={item.translate}
                            index={index}
                            type={'card'}
                            item={item}
                            lang={lang.from}
                        />
                    ) : renderOriginal(item, alphabets, index)}
                </div>
                <div className={'results-card__details'}>{item.details}</div>
                <div className={'results-card__original'}>
                    {lang.from === 'isv' ? (
                        <Clipboard
                            str={item.translate}
                            index={index}
                            type={'card'}
                            item={item}
                            lang={lang.to}
                        />
                    ) : renderOriginal(item, alphabets, index)}
                </div>
                <button
                    className={'results-card__favorite-button'}
                    type={'button'}
                    aria-label={'Show translates'}
                    onClick={setFavorite}
                >
                    {isFavorite ? '★' : '☆'}
                </button>
                <div className={'results-card__actions'}>
                    <button
                        className={'results-card__show-translates-button'}
                        type={'button'}
                        aria-label={'Show translates'}
                        onClick={showTranslations}
                    >
                        {t('translates')}
                    </button>
                    {showFormsButtonIsVisible(item) && (
                        <button
                            className={'results-card__show-forms-button'}
                            type={'button'}
                            aria-label={'Show forms'}
                            onClick={showDetail}
                        >
                            {pos === 'verb' ? t('conjugation') : t('declensions')}
                        </button>
                    )}
                </div>
                <div className={classNames('results-card__status-badge', {verified: item.checked})}>
                    {item.checked ? t('verified') : t('autoTranslation')}
                </div>
            </div>
        );
    };
