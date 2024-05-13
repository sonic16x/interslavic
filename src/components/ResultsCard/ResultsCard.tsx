import classNames from 'classnames';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { t } from 'translations';

import { setNotificationAction, showModalDialog } from 'actions';
import { MODAL_DIALOG_TYPES } from 'reducers';

import { biReporter, ICardAnalytics } from 'services/biReporter';
import { Dictionary, ITranslateResult } from 'services/dictionary';

import { useAlphabets } from 'hooks/useAlphabets';
import { useIntersect } from 'hooks/useIntersect';
import { useLang } from 'hooks/useLang';
import { useShortCardView } from 'hooks/useShortCardView';
import { estimateIntelligibility, hasIntelligibilityIssues } from "utils/intelligibilityIssues";
import { toQueryString } from 'utils/toQueryString';
import { getPartOfSpeech } from 'utils/wordDetails';
import { wordHasForms } from 'utils/wordHasForms';

import { Clipboard } from 'components/Clipboard';

import { removeBrackets } from "../../utils/removeBrackets";

import './ResultsCard.scss';

import ErrorIcon from './images/error-icon.svg';
import FormsIcon from './images/forms-icon.svg';
import ShareIcon from './images/share-icon.svg';
import TranslationsIcon from './images/translations-icon.svg';

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
            {result.map(({ str, lang }, i) => {
                return (
                    <Clipboard
                        className="word"
                        key={i}
                        str={str}
                        index={index}
                        item={item}
                        type="card"
                        lang={lang}
                    />
                );
            })} 
            {item.caseInfo && <> <span className="caseInfo">(+{t(`case${item.caseInfo.slice(1)}`)})</span></>}
            {item.ipa && <> <span className="ipa">[{item.ipa}]</span></>}
        </>
    );
}

export const ResultsCard =
    ({ item, index }: IResultsCardProps) => {
        const alphabets = useAlphabets();
        const wordId = Dictionary.getField(item.raw, 'id').toString();
        const pos = getPartOfSpeech(item.details);
        const dispatch = useDispatch();
        const intelligibility = Dictionary.getField(item.raw, 'intelligibility');
        const intelligibilityVector = estimateIntelligibility(intelligibility);
        const lang = useLang();

        const cardBiInfo: ICardAnalytics = useMemo(() => (
            {
                checked: item.checked,
                wordId,
                isv: Dictionary.getField(item.raw, 'isv'),
                index,
            }
        ), [item.checked, item.raw, wordId, index]);

        const onShown = useCallback(() => {
            biReporter.showCard(cardBiInfo);
        }, [cardBiInfo]);

        const [setRef] = useIntersect({
            threshold: 0.5,
            onShown,
        });

        const reportClick = () => {
            biReporter.cardInteraction('click card', cardBiInfo);
        };

        const showTranslations = () => {
            biReporter.cardInteraction('show forms', cardBiInfo);
            dispatch(showModalDialog({
                type: MODAL_DIALOG_TYPES.MODAL_DIALOG_TRANSLATION,
                data: { index },
            }));
        };

        const showWordErrorModal = () => {
            // biReporter.cardInteraction('show forms', cardBiInfo);
            dispatch(showModalDialog({
                type: MODAL_DIALOG_TYPES.MODAL_DIALOG_WORD_ERROR,
                data: {
                    wordId,
                    isvWord: item.original,
                    translatedWord: item.translate,
                },
            }));
        };

        const showDetail = () => {
            biReporter.cardInteraction('show translations', cardBiInfo);
            dispatch(showModalDialog({
                type: MODAL_DIALOG_TYPES.MODAL_DIALOG_WORD_FORMS,
                data: {
                    word: removeBrackets(Dictionary.getField(item.raw, 'isv'), '[', ']'),
                    add: Dictionary.getField(item.raw, 'addition'),
                    details: Dictionary.getField(item.raw, 'partOfSpeech'),
                },
            }));
        };

        const shareWord = () => {
            const { origin, pathname } = window.location;
            const query = toQueryString({
                text: `id${wordId}`,
                lang: `${lang.from}-${lang.to}`,
            });

            const url = `${origin}${pathname}?${query}`;

            if (navigator.share) {
                navigator.share({
                    url,
                });
            } else {
                navigator.clipboard.writeText(url).then(() => {
                    const notificationText = t('wordLinkCopied', {
                        str: url,
                    });
                    dispatch(setNotificationAction({ text: notificationText }));
                });
            }
        }

        const short = useShortCardView();

        return (
            <div
                className={classNames('results-card', { short })}
                ref={setRef}
                tabIndex={0}
                onClick={reportClick}
            >
                <div className="results-card__translate">
                    {item.to !== 'isv' ? (
                        <Clipboard
                            str={item.translate}
                            index={index}
                            type="card"
                            item={item}
                            lang={item.to}
                        />
                    ) : renderOriginal(item, alphabets, index)}
                    {'\u00A0'}
                    { hasIntelligibilityIssues(intelligibilityVector)
                        ? <button
                            key="intelligibilityIssues"
                            onClick={showTranslations}
                            className={classNames({ 'results-card__status': true })}
                            title={t('intelligibilityIssues')}>⚠️</button>
                        : undefined
                    }
                    {item.to === 'isv' && short && (
                        <>
                            &nbsp;
                            <span className="results-card__details">{item.details}</span>
                        </>
                    )}
                </div>
                {!short && (
                    <span className="results-card__details">{item.details}</span>
                )}
                <div className="results-card__bottom">
                    <div className="results-card__original">
                        {item.to === 'isv' ? (
                            <Clipboard
                                str={item.translate}
                                index={index}
                                type="card"
                                item={item}
                                lang={item.from}
                            />
                        ) : renderOriginal(item, alphabets, index)}
                        {item.to !== 'isv' && short && (
                            <span className="results-card__details">{item.details}</span>
                        )}
                    </div>
                    <div className="results-card__actions">
                        <button
                            className="results-card__action-button"
                            type="button"
                            aria-label={t('shareWord')}
                            onClick={shareWord}
                        >
                            {short ? <ShareIcon /> : t('shareWord')}
                        </button>
                        <button
                            className="results-card__action-button"
                            type="button"
                            aria-label={t('reportWordError')}
                            onClick={showWordErrorModal}
                        >
                            {short ? <ErrorIcon /> : t('reportWordError')}
                        </button>
                        <button
                            className="results-card__action-button"
                            type="button"
                            aria-label={t('translates')}
                            onClick={showTranslations}
                        >
                            {short ? <TranslationsIcon /> : t('translates')}
                        </button>
                        {wordHasForms(item.original, item.details) && (
                            <button
                                className="results-card__action-button"
                                type="button"
                                aria-label={t('declensions')}
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
                </div>
                <div className={classNames('results-card__status-badge', { verified: item.checked })}>
                    {!short && (item.checked ? t('verified') : t('autoTranslation'))}
                </div>
            </div>
        );
    };
