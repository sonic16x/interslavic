import classNames from 'classnames'
import { lazy, Suspense, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { hideModalDialog } from 'actions'
import { MODAL_DIALOG_TYPES } from 'reducers'

import { useModalDialog } from 'hooks'

const DetailModal = lazy(() => import('components/Modals/DetailModal/DetailModal'))
const TranslationsModal = lazy(() => import('components/Modals/TranslationsModal/TranslationsModal'))
const WordErrorModal = lazy(() => import('components/Modals/WordErrorModal/WordErrorModal'))

import { Spinner } from 'components/Spinner'

import './ModalDialog.scss'

function getModalDialog(type: MODAL_DIALOG_TYPES) {
    switch (type) {
        case MODAL_DIALOG_TYPES.MODAL_DIALOG_TRANSLATION:
            return (
                <Suspense
                    fallback={<Spinner size="4em" borderWidth="0.3em" />}
                >
                    <TranslationsModal/>
                </Suspense>
            )
        case MODAL_DIALOG_TYPES.MODAL_DIALOG_WORD_FORMS:
            return (
                <Suspense
                    fallback={<Spinner size="4em" borderWidth="0.3em" />}
                >
                    <DetailModal/>
                </Suspense>
            )
        case MODAL_DIALOG_TYPES.MODAL_DIALOG_WORD_ERROR:
            return (
                <Suspense fallback={<Spinner size="4em" borderWidth="0.3em" />}>
                    <WordErrorModal/>
                </Suspense>
            )
        default:
            return null
    }
}

export const ModalDialog =
    () => {
        const { type, show } = useModalDialog()
        const content = show ? getModalDialog(type) : null
        const dispatch = useDispatch()
        const onKeyPress = useCallback(({ code }) => {
            if (code === 'Escape') {
                dispatch(hideModalDialog())
            }
        }, [dispatch])
        const onBackdropClick = useCallback(() => {
            dispatch(hideModalDialog())
        }, [dispatch])

        useEffect(() => {
            window.addEventListener('keyup', onKeyPress)

            return () => {
                window.removeEventListener('keyup', onKeyPress)
            }
        }, [onKeyPress])

        return (
            <div className={classNames('modal-dialog-container', { show })}>
                <div className="modal-dialog-back" onClick={onBackdropClick}/>
                <dialog className="modal-dialog">
                    {content}
                </dialog>
            </div>
        )
    }
