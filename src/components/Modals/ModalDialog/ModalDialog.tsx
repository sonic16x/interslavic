import classNames from 'classnames'
import { lazy, Suspense, useCallback, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { hideModalDialog } from 'actions'
import { MODAL_DIALOG_TYPES } from 'reducers'

import { useModalDialog } from 'hooks'

const DetailModal = lazy(() => import('components/Modals/DetailModal'))
const TranslationsModal = lazy(() => import('components/Modals/TranslationsModal'))
const WordErrorModal = lazy(() => import('components/Modals/WordErrorModal'))

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
        const dialog = useRef<HTMLDialogElement>(null)
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

        // A modal window: the page before it goes inert (no Tab, no screen reader), focus moves in and returns to
        // the trigger on close. Not showModal(): the notification and the tooltips after it stay above and live.
        useEffect(() => {
            const container = dialog.current?.parentElement
            if (!show || !container) {
                return
            }
            const behind: HTMLElement[] = []
            for (let el = container.previousElementSibling; el; el = el.previousElementSibling) {
                behind.push(el as HTMLElement)
            }
            behind.forEach((el) => { el.inert = true })
            const trigger = document.activeElement as HTMLElement | null
            dialog.current.focus()

            return () => {
                behind.forEach((el) => { el.inert = false })
                trigger?.focus()
            }
        }, [show])

        return (
            <div className={classNames('modal-dialog-container', { show })}>
                <div className="modal-dialog-back" onClick={onBackdropClick}/>
                <dialog
                    ref={dialog}
                    className="modal-dialog"
                    tabIndex={-1}
                    aria-modal={show || undefined}
                    aria-labelledby={show ? 'modal-dialog-title' : undefined}
                >
                    {content}
                </dialog>
            </div>
        )
    }
