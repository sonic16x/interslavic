import classNames from 'classnames'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { t } from 'translations'

import { fromTextAction, langAction, setSearchExpand } from 'actions'

import {
    useDictionaryLanguages,
    useFromText,
    useLang,
    useSearchExpanded,
    useShortCardView,
} from 'hooks'
import { toBCP47 } from 'utils'

import {
    Expand,
    FlavorisationSelector,
    InputText,
    LangSelector,
    POSSelector,
    SearchTypeSelector,
} from 'components'

import './Controls.scss'

interface IControlsProps {
    expanded?: boolean;
}

export const Controls =
    ({ expanded }: IControlsProps) => {
        const dispatch = useDispatch()
        const expand = useSearchExpanded() || expanded
        const short = useShortCardView()

        const lang = useLang()
        const langs = ['en', ...useDictionaryLanguages()]
        const fromText = useFromText()
        const spellCheck = lang.from !== 'isv'
        const searchLanguage = toBCP47(lang.from)

        const onChange = useCallback((value) => {
            dispatch(fromTextAction(value))
        }, [dispatch])

        const onChangeExpand = () => dispatch(setSearchExpand(!expand))

        const onLangChange = useCallback((newLang) => {
            dispatch(langAction(newLang))
        }, [dispatch])


        return (
            <div
                className={classNames('controls', { short })}
            >
                <LangSelector
                    lang={lang}
                    langs={langs}
                    onChange={onLangChange}
                />
                <InputText
                    testId="search-input"
                    size="L"
                    value={fromText}
                    onChange={onChange}
                    placeholder={t('typeWordLabel')}
                    type="search"
                    lang={searchLanguage}
                    autoCapitalize="false"
                    autoComplete={spellCheck ? 'true' : 'false'}
                    autoCorrect={spellCheck ? 'true' : 'false'}
                    spellCheck={spellCheck}
                />
                <Expand
                    isExpanded={expand}
                    onChange={onChangeExpand}
                >
                    <SearchTypeSelector key="searchType" />
                    <FlavorisationSelector key="flavorisation" />
                    <POSSelector key="posFilter" />
                </Expand>
            </div>
        )
    }
