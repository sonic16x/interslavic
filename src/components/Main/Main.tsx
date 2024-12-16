import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { isLoadingAction, runSearch } from 'actions'

import { fetchDictionary } from 'services'

import { useDarkTheme, useDictionaryLanguages } from 'hooks'

import {
    Header,
    Loader,
    ModalDialog,
    Notification,
    Router,
} from 'components'

import './Main.scss'

export const Main =
    () => {
        const dispatch = useDispatch()
        const dictionaryLanguages = useDictionaryLanguages()
        const isDarkTheme = useDarkTheme()
        const theme = isDarkTheme ? 'dark' : 'light'

        useEffect(() => {
            document.getElementById('app').className = `color-theme--${theme}`
        }, [theme])

        useEffect(() => {
            (async () => {
                await fetchDictionary(dictionaryLanguages)

                dispatch(isLoadingAction(false))
                dispatch(runSearch())
            })()
        }, [dictionaryLanguages])

        return (
            <>
                <Header/>
                <Router/>
                <Loader/>
                <ModalDialog/>
                <Notification/>
            </>
        )
    }
