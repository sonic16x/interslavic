import classNames from 'classnames'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { ADD_LANGS, EN, interfaceLanguageList } from 'consts'

import { t } from 'translations'

import {
    changeCardViewAction,
    changeCaseQuestions,
    changeDictionaryLangAction,
    changeDisplayImperfect,
    changeIsvSearchByWordForms,
    changeIsvSearchLetters,
    changeOrderOfCases,
    langAction, runSearch,
    setAlphabets,
    setInterfaceLang,
    togglePage,
    toggleThemeAction,
} from 'actions'

import { fetchLang } from 'services'

import {
    useAlphabets,
    useCaseQuestions,
    useColorTheme,
    useDictionaryLanguages,
    useDisplayImperfect,
    useEnabledPages,
    useInterfaceLang,
    useIsvSearchByWordForms,
    useIsvSearchLetters,
    useLang,
    useOrderOfCases,
    useResults,
    useShortCardView,
} from 'hooks'

import { Checkbox, Selector, Spinner } from 'components'

import './Settings.scss'


const orderOfCasesList = [
    'nom,acc,gen,loc,dat,ins,voc',
    'nom,acc,gen,dat,loc,ins,voc',
    'nom,gen,dat,acc,ins,loc,voc',
    'nom,gen,dat,acc,voc,loc,ins',
    'nom,gen,dat,acc,voc,ins,loc',
]

export const Settings =
    () => {
        const dispatch = useDispatch()
        const interfaceLang = useInterfaceLang()
        const alphabets = useAlphabets()
        const isvSearchLetters = useIsvSearchLetters()
        const isShortCardView = useShortCardView()
        const isDarkTheme = useColorTheme() === 'dark'
        const isvSearchByWordForms = useIsvSearchByWordForms()
        const caseQuestions = useCaseQuestions()
        const displayImperfect = useDisplayImperfect()
        const orderOfCases = useOrderOfCases()
        const dictionaryLanguages = useDictionaryLanguages()
        const enabledPages = useEnabledPages()
        const { from, to } = useLang()
        const [isLoading, setLoading] = useState(false)
        useResults()

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
                <Checkbox
                    className="bold"
                    title={t('darkTheme')}
                    checked={isDarkTheme}
                    onChange={() => dispatch(toggleThemeAction(isDarkTheme ? 'light' : 'dark'))}
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
                        }
                    })}
                    value={orderOfCases.join(',')}
                    onSelect={(orderOfCases: string) => dispatch(changeOrderOfCases(orderOfCases.split(',')))}
                />
                <hr/>
                <Checkbox
                    className="bold"
                    title={t('caseQuestionsForPrepositions')}
                    checked={caseQuestions}
                    onChange={() => dispatch(changeCaseQuestions(!caseQuestions))}
                />
                <hr/>
                <Checkbox
                    className="bold"
                    title={t('showImperfectAndPluperfect')}
                    checked={displayImperfect}
                    onChange={() => dispatch(changeDisplayImperfect(!displayImperfect))}
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
                    {ADD_LANGS.map((lang) => {
                        const checked = dictionaryLanguages.includes(lang)

                        return (
                            <Checkbox
                                key={lang}
                                title={t(`${lang}Lang`)}
                                checked={checked}
                                onChange={async () => {
                                    setLoading(true)
                                    await fetchLang(lang)

                                    if (checked && from === lang) {
                                        dispatch(langAction({
                                            from: EN,
                                            to,
                                        }))
                                    }

                                    if (checked && to === lang) {
                                        dispatch(langAction({
                                            from,
                                            to: EN,
                                        }))
                                    }

                                    dispatch(changeDictionaryLangAction(lang))
                                    dispatch(runSearch())
                                    setLoading(false)
                                }}
                            />
                        )
                    })}
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
        )
    }
