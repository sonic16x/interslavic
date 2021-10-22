import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { t } from 'translations';
import './index.scss';
import { Dictionary, ITranslateResult } from 'services/dictionary';
import { getPartOfSpeech } from 'utils/wordDetails';
import classNames from 'classnames';
import { MODAL_DIALOG_TYPES } from 'reducers';
import { Clipboard } from 'components/Clipboard';
import { setFavoriteAction, showModalDialog } from 'actions';
import { biReporter, ICardAnalytics } from 'services/biReporter';
import { useIntersect } from 'hooks/useIntersect';
import { useAlphabets } from 'hooks/useAlphabets';
import { useFavorite } from 'hooks/useFavorite';
import { useLang } from 'hooks/useLang';
import { useShortCardView } from 'hooks/useShortCardView';
import FormsIcon from './images/forms-icon.svg';
import TranslationsIcon from './images/translations-icon.svg';
import { wordHasForms } from 'utils/wordHasForms';

interface IResultsCardProps {
    item: ITranslateResult;
    index: number;
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

export const ResultsCard =
    ({item, index}: IResultsCardProps) => {
        const alphabets = useAlphabets();
        const lang = useLang();
        const id = Dictionary.getField(item.raw, 'id').toString();
        const isFavorite = useFavorite()[id];
        const pos = getPartOfSpeech(item.details);
        const dispatch = useDispatch();
        const cardBiInfo: ICardAnalytics = {
            checked: item.checked,
            wordId: id,
            isv: Dictionary.getField(item.raw, 'isv'),
            index,
        };

        const onShown = useCallback((entry) => {
            biReporter.showCard(cardBiInfo);
        }, [id, index]);

        const [setRef] = useIntersect({
            threshold: 0.5,
            onShown,
        });

        const reportClick = useCallback(() => {
            biReporter.cardInteraction('click card', cardBiInfo);
        }, [id, index]);
        const showTranslations = useCallback(() => {
            biReporter.cardInteraction('show forms', cardBiInfo);
            dispatch(showModalDialog({
                type: MODAL_DIALOG_TYPES.MODAL_DIALOG_TRANSLATION,
                data: { index },
            }));
        }, [index]);
        const showDetail = useCallback(() => {
            biReporter.cardInteraction('show translations', cardBiInfo);
            dispatch(showModalDialog({
                type: MODAL_DIALOG_TYPES.MODAL_DIALOG_WORD_FORMS,
                data: {
                    word: Dictionary.getField(item.raw, 'isv'),
                    add: Dictionary.getField(item.raw, 'addition'),
                    details: Dictionary.getField(item.raw, 'partOfSpeech'),
                },
            }));
        }, [item]);
        const setFavorite = useCallback(() => {
            dispatch(setFavoriteAction(id));
        }, [id]);
        const short = useShortCardView();

        return (
            <div className={classNames('results-card', {short})} ref={setRef} tabIndex={0} onClick={reportClick}>
                <div className={'results-card__translate'}>
                    {lang.to !== 'isv' ? (
                        <Clipboard
                            str={item.translate}
                            index={index}
                            type={'card'}
                            item={item}
                            lang={lang.to}
                        />
                    ) : renderOriginal(item, alphabets, index)}
                    {lang.to === 'isv' && short && (
                        <>
                            &nbsp;
                            <span className={'results-card__details'}>{item.details}</span>
                        </>
                    )}
                </div>
                {!short && (
                    <span className={'results-card__details'}>{item.details}</span>
                )}
                <div className={'results-card__original'}>
                    {lang.to === 'isv' ? (
                        <Clipboard
                            str={item.translate}
                            index={index}
                            type={'card'}
                            item={item}
                            lang={lang.from}
                        />
                    ) : renderOriginal(item, alphabets, index)}
                    {lang.to !== 'isv' && short && (
                        <span className={'results-card__details'}>{item.details}</span>
                    )}
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
                        {short ? <TranslationsIcon /> : t('translates')}
                    </button>
                    {wordHasForms(item.original, item.details) && (
                        <button
                            className={'results-card__show-forms-button'}
                            type={'button'}
                            aria-label={'Show forms'}
                            onClick={showDetail}
                        >
                            {short ? (
                                <FormsIcon />
                            ) : (
                                pos === 'verb' ? t('conjugation') : t('declensions')
                            )}
                        </button>
                    )}
                </div>
                <div className={classNames('results-card__status-badge', {verified: item.checked})}>
                    {!short && (item.checked ? t('verified') : t('autoTranslation'))}
                </div>
            </div>
        );
    };
