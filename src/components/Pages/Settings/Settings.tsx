import classNames from 'classnames';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { addLangs } from 'consts';

import { t } from 'translations';

import {
    changeCardViewAction,
    changeDictionaryLangAction,
    changeIsvSearchByWordForms,
    changeIsvSearchLetters,
    changeOrderOfCases, changeSrLangVariant,
    langAction,
    setAlphabets,
    setInterfaceLang,
    togglePage,
} from 'actions';

import { fetchLang } from 'services/fetchDictionary';

import { useAlphabets } from 'hooks/useAlphabets';
import { useDictionaryLanguages } from 'hooks/useDictionaryLanguages';
import { useEnabledPages } from 'hooks/useEnabledPages';
import { useInterfaceLang } from 'hooks/useInterfaceLang';
import { useIsvSearchByWordForms } from 'hooks/useIsvSearchByWordForms';
import { useIsvSearchLetters } from 'hooks/useIsvSearchLetters';
import { useLang } from 'hooks/useLang';
import { useOrderOfCases } from 'hooks/useOrderOfCases';
import { useResults } from 'hooks/useResults';
import { useShortCardView } from 'hooks/useShortCardView';
import { useSrLangVariant } from 'hooks/useSrLangVariant';

import { Checkbox } from 'components/Checkbox';
import { Selector } from 'components/Selector';
import { Spinner } from 'components/Spinner';

import './Settings.scss';

const interfaceLanguageList = [
    {
        name: 'English',
        value: 'en',
    },
    {
        name: 'Medžuslovjansky',
        value: 'isv-Latn',
    },
    {
        name: 'Меджусловјанскы',
        value: 'isv-Cyrl',
    },
    {
        name: 'Ⰿⰵⰴⰶⱆⱄⰾⱁⰲⰺⰰⱀⱄⰽⱐⰹ',
        value: 'isv-Glag',
    },
    {
        name: 'Русский',
        value: 'ru',
    },
    {
        name: 'Українська',
        value: 'uk',
    },
    {
        name: 'Беларуская',
        value: 'be',
    },
    {
        name: 'Polski',
        value: 'pl',
    },
    {
        name: 'Česky',
        value: 'cs',
    },
    {
        name: 'Slovenský',
        value: 'sk',
    },
    {
        name: 'Slovenščina',
        value: 'sl',
    },
    {
        name: 'Hrvatski',
        value: 'hr',
    },
    {
        name: 'Српски',
        value: 'sr',
    },
    {
        name: 'Македонски',
        value: 'mk',
    },
    {
        name: 'Български',
        value: 'bg',
    },
];

const srLangVariantList = [
    {
        name: 'Екавица, ћирилица',
        value: 'ekavicaCyr'
    },
    {
        name: 'Ијекавица, ћирилица',
        value: 'ijekavicaCyr'
    },
    {
        name: 'Ekavica, latinica',
        value: 'ekavicaLat'
    },
    {
        name: 'Ijekavica, latinica',
        value: 'ijekavicaLat'
    },
];

const orderOfCasesList = [
    'nom,acc,gen,loc,dat,ins,voc',
    'nom,acc,gen,dat,loc,ins,voc',
    'nom,gen,dat,acc,ins,loc,voc',
    'nom,gen,dat,acc,voc,loc,ins',
    'nom,gen,dat,acc,voc,ins,loc',
];

export const Settings =
    () => {
        const dispatch = useDispatch();
        const interfaceLang = useInterfaceLang();
        const alphabets = useAlphabets();
        const isvSearchLetters = useIsvSearchLetters();
        const isShortCardView = useShortCardView();
        const isvSearchByWordForms = useIsvSearchByWordForms();
        const orderOfCases = useOrderOfCases();
        const dictionaryLanguages = useDictionaryLanguages();
        const enabledPages = useEnabledPages();
        const srLangVariant = useSrLangVariant();
        const { from, to } = useLang();
        const [isLoading, setLoading] = useState(false);
        useResults();

        return (
            <div className="settings">
                <h4>{t('settingsTitle')}</h4>
                <hr/>
                <h6>{t('interfaceLanguage')}</h6>
                <Selector
                    options={interfaceLanguageList}
                    value={interfaceLang}
                    onSelect={(langCode: string) => dispatch(setInterfaceLang(langCode))}
                />
                <hr/>
                <Checkbox
                    className="bold"
                    title={t('shortCardView')}
                    checked={isShortCardView}
                    onChange={() => dispatch(changeCardViewAction())}
                />
                <hr/>
                <h6>{t('showSlavicWordsInAlphabets')}</h6>
                <Checkbox
                    title={t('latin')}
                    checked={alphabets.latin}
                    onChange={() => dispatch(setAlphabets({ latin: !alphabets.latin }))}
                />
                <Checkbox
                    title={t('cyrillic')}
                    checked={alphabets.cyrillic}
                    onChange={() => dispatch(setAlphabets({ cyrillic: !alphabets.cyrillic }))}
                />
                <Checkbox
                    title={t('glagolitic')}
                    checked={alphabets.glagolitic}
                    onChange={() => dispatch(setAlphabets({ glagolitic: !alphabets.glagolitic }))}
                />
                <hr/>
                <h6>{t('searchSensitiveLettersForInterslavic')}</h6>
                <div className="settings__isv-search-letters">
                    <p>{t('standardOrthography')}</p>
                    <Checkbox
                        title="ž š č (ж ш ч)"
                        checked={isvSearchLetters.from.includes('ž')}
                        onChange={() => dispatch(changeIsvSearchLetters('žšč'))}
                    />
                    <Checkbox
                        title="ě (є)"
                        checked={isvSearchLetters.from.includes('ě')}
                        onChange={() => dispatch(changeIsvSearchLetters('ě'))}
                    />
                    <Checkbox
                        title="y (ы)"
                        checked={isvSearchLetters.from.includes('y')}
                        onChange={() => dispatch(changeIsvSearchLetters('y'))}
                    />
                    <p>{t('etymologicalOrthography')}</p>
                    <Checkbox
                        title="å"
                        checked={isvSearchLetters.from.includes('å')}
                        onChange={() => dispatch(changeIsvSearchLetters('å'))}
                    />
                    <Checkbox
                        title="ę ų"
                        checked={isvSearchLetters.from.includes('ę')}
                        onChange={() => dispatch(changeIsvSearchLetters('ęų'))}
                    />
                    <Checkbox
                        title="ė ȯ"
                        checked={isvSearchLetters.from.includes('ȯ')}
                        onChange={() => dispatch(changeIsvSearchLetters('ėȯ'))}
                    />
                    <Checkbox
                        title="ŕ"
                        checked={isvSearchLetters.from.includes('ŕ')}
                        onChange={() => dispatch(changeIsvSearchLetters('ŕ'))}
                    />
                    <Checkbox
                        title="ĺ ń"
                        checked={isvSearchLetters.from.includes('ĺ')}
                        onChange={() => dispatch(changeIsvSearchLetters('ĺń'))}
                    />
                    <Checkbox
                        title="t́ d́"
                        checked={isvSearchLetters.from.includes('ť')}
                        onChange={() => dispatch(changeIsvSearchLetters('ťď'))}
                    />
                    <Checkbox
                        title="ś ź"
                        checked={isvSearchLetters.from.includes('ś')}
                        onChange={() => dispatch(changeIsvSearchLetters('śź'))}
                    />
                    <Checkbox
                        title="ć"
                        checked={isvSearchLetters.from.includes('ć')}
                        onChange={() => dispatch(changeIsvSearchLetters('ć'))}
                    />
                    <Checkbox
                        title="đ"
                        checked={isvSearchLetters.from.includes('đ')}
                        onChange={() => dispatch(changeIsvSearchLetters('đ'))}
                    />
                </div>
                <hr/>
                <Checkbox
                    className="bold"
                    title={t('searchByIsvWordForms')}
                    checked={isvSearchByWordForms}
                    onChange={() => dispatch(changeIsvSearchByWordForms(!isvSearchByWordForms))}
                />
                <hr/>
                <h6>{t('orderOfCases')}</h6>
                <Selector
                    options={orderOfCasesList.map((e) => {
                        return {
                            name: e.split(',').map((c) => t(`case${c[0].toUpperCase()}${c.slice(1)}`)).join(', '),
                            value: e,
                        };
                    })}
                    value={orderOfCases.join(',')}
                    onSelect={(orderOfCases: string) => dispatch(changeOrderOfCases(orderOfCases.split(',')))}
                />
                <hr />
                <h6 className="settings__add-langs-title">
                    {t('addDictionaryLanguages')}
                    {isLoading && (
                        <Spinner
                            size="10px"
                            borderWidth="3px"
                        />
                    )}
                </h6>
                <div className={classNames('settings__add-langs', { 'settings__add-langs-loading': isLoading })}>
                    {addLangs.map((lang, i) => {
                        const checked = dictionaryLanguages.includes(lang);

                        return (
                            <Checkbox
                                key={i}
                                title={t(`${lang}Lang`)}
                                checked={checked}
                                onChange={async () => {
                                    setLoading(true);
                                    await fetchLang(lang);

                                    if (checked && from === lang) {
                                        dispatch(langAction({
                                            from: 'en',
                                            to,
                                        }));
                                    }

                                    if (checked && to === lang) {
                                        dispatch(langAction({
                                            from,
                                            to: 'en',
                                        }));
                                    }

                                    dispatch(changeDictionaryLangAction(lang));
                                    setLoading(false);
                                }}
                            />
                        );
                    })}
                </div>
                <hr />
                <div>
                    <h6>{t('srLangVariant')}</h6>
                    <Selector
                        options={srLangVariantList}
                        value={srLangVariant}
                     onSelect={(srLangVariant:string) => dispatch(changeSrLangVariant(srLangVariant))}/>
                </div>
                <hr />
                <div>
                    <h6>{t('devTools')}</h6>
                    <Checkbox
                        key="viewer"
                        title={t('viewerEnable')}
                        checked={enabledPages.includes('viewer')}
                        onChange={() => dispatch(togglePage('viewer'))}
                    />
                </div>
            </div>
        );
    };
