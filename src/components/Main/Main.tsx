import { useEffect, useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'

import { isLoadingAction, runSearch } from 'actions'

import { fetchDictionary } from 'services'

import { useColorTheme, useDictionaryLanguages } from 'hooks'

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
        const theme = useColorTheme()

        useLayoutEffect(() => {
            document.getElementById('app').className = `color-theme--${theme}`
        }, [theme])

        useEffect(() => {
            fetchDictionary(dictionaryLanguages).then(() => {
                dispatch(isLoadingAction(false))
                dispatch(runSearch())
            })
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
