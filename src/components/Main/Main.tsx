import { useEffect, useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'

import { isLoadingAction, runSearch } from 'actions'

import { fetchDictionary } from 'services'

import { useColorTheme, useDictionaryLanguages } from 'hooks'

import {
    Header,
    ModalDialog,
    Notification,
    Router,
} from 'components'

import './Main.scss'

const hideLoader = () => {
    const loaderElement = document.getElementById('loader') as HTMLDivElement
    const transitionEnd = () => {
        loaderElement.removeEventListener('transitionend', transitionEnd)
        loaderElement.remove()
    }
    loaderElement.addEventListener('transitionend', transitionEnd)
    loaderElement.style.opacity = '0'
}

export const Main =
    () => {
        const dispatch = useDispatch()
        const dictionaryLanguages = useDictionaryLanguages()
        const theme = useColorTheme()

        useLayoutEffect(() => {
            document.body.className = `color-theme--${theme}`
        }, [theme])

        useEffect(() => {
            fetchDictionary(dictionaryLanguages).then(() => {
                dispatch(isLoadingAction(false))
                dispatch(runSearch())
                hideLoader()
            })
        }, [dictionaryLanguages])

        return (
            <>
                <Header/>
                <Router/>
                <ModalDialog/>
                <Notification/>
            </>
        )
    }
