import * as React from 'react';
import { useDispatch } from 'react-redux';
import { t } from 'translations';
import './index.scss';
import { Dictionary, ITranslateResult } from 'utils/dictionary';
import { getPartOfSpeech } from 'utils/wordDetails';
import classNames from 'classnames';
import { IAlphabets } from 'reducers';
import { Clipboard } from 'components/Clipboard';
import {
    showDetailAction,
    setDetailAction,
    showTranslationsAction,
    setTranslationsAction,
    setFavoriteAction,
} from 'actions';

interface IResultsCardProps {
    item: ITranslateResult;
    alphabets: IAlphabets;
    lang: string;
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

function renderOriginal(item, alphabets) {
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
        result.push(latin);
    }

    if (alphabets.cyrillic) {
        result.push(cyrillic);
    }

    if (alphabets.glagolitic) {
        result.push(gla);
    }

    return (
        <>
            {result.map((str, i) => {
                return (
                    <Clipboard
                        className={'word'}
                        key={i}
                        str={str}
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
        const showTranslations = React.useCallback(() => {
            dispatch(setTranslationsAction(index));
            dispatch(showTranslationsAction());
        }, [index]);
        const showDetail = React.useCallback(() => {
            dispatch(setDetailAction(index));
            dispatch(showDetailAction());
        }, [index]);
        const setFavorite = React.useCallback(() => {
            dispatch(setFavoriteAction(id));
        }, [id]);

        return (
            <div className={'results-card'} tabIndex={0}>
                <div className={'results-card__translate'}>
                    {lang !== 'isv' ? <Clipboard str={item.translate}/> : renderOriginal(item, alphabets)}
                </div>
                <div className={'results-card__details'}>{item.details}</div>
                <div className={'results-card__original'}>
                    {lang === 'isv' ? <Clipboard str={item.translate}/> : renderOriginal(item, alphabets)}
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
