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

const standardOrthography = [
    ['ž š č (ж ш ч)', 'ž', 'žšč'],
    ['ě (є)', 'ě', 'ě'],
    ['y (ы)', 'y', 'y'],
]

const etymologicalOrthography = [
    ['å', 'å', 'å'],
    ['ę ų', 'ę', 'ęų'],
    ['ė ȯ', 'ȯ', 'ėȯ'],
    ['ŕ', 'ŕ', 'ŕ'],
    ['ĺ ń', 'ĺ', 'ĺń'],
    ['t́ d́', 'ť', 'ťď'],
    ['ś ź', 'ś', 'śź'],
    ['ć', 'ć', 'ć'],
    ['đ', 'đ', 'đ'],
]

const orthographySettings: Array<[string, string[][]]> = [
    ['standardOrthography', standardOrthography],
    ['etymologicalOrthography', etymologicalOrthography],
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
                {
                    Object.keys(alphabets).map((alphabet) => (
                        <Checkbox
                            key={alphabet}
                            title={t(alphabet)}
                            checked={alphabets[alphabet]}
                            onChange={() => dispatch(setAlphabets({ [alphabet]: !alphabets[alphabet] }))}
                        />
                    ))
                }
                <hr/>
                <h6>{t('searchSensitiveLettersForInterslavic')}</h6>
                <div className="settings__isv-search-letters">
                    {
                        orthographySettings.map(([title, letters]) => (
                            <div key={title}>
                                <p>{t(title)}</p>
                                {
                                    letters.map(([title, value, action]) => (
                                        <Checkbox
                                            key={title}
                                            title={title}
                                            checked={isvSearchLetters.from.includes(value)}
                                            onChange={() => dispatch(changeIsvSearchLetters(action))}
                                        />
                                    ))
                                }
                            </div>
                        ))
                    }
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
