import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { captchaSiteKey, wordErrorsTypes, wordErrorTextMaxLength } from 'consts'

import { t } from 'translations'

import { hideModalDialog, setNotificationAction } from 'actions'

import {
    useClientId,
    useInterfaceLang,
    useLang,
    useModalDialog,
} from 'hooks'
import { isOnline } from 'utils'

import {
    Button,
    Confirm,
    OfflinePlaceholder,
    Selector,
    Spinner,
    Textarea,
} from 'components'

import './WordErrorModal.scss'


function loadCaptchaScript() {
    return new Promise((resolve, reject) => {
        const scriptId = 'turnstile-script'
        if (document.getElementById(scriptId)) {
            resolve(true)
        } else {
            const script = document.createElement('script')
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?compat=recaptcha'
            script.id = scriptId
            script.async = true
            script.onload = resolve
            script.onerror = reject
            document.body.appendChild(script)
        }
    })
}

export const WordErrorModal = () => {
    useInterfaceLang()
    const online = isOnline()
    const dispatch = useDispatch()
    const [textValue, setTextValue] = useState<string>('')
    const [captchaToken, setCaptchaToken] = useState<string>('')
    const [errorType, setErrorType] = useState<string>('translate')
    const [isLoading, setLoader] = useState<boolean>(false)
    const [isConfirm, setConfirm] = useState<boolean>(false)
    const [firstSubmit, setFirstSubmit] = useState<boolean>(true)
    const [textareaError, setTextareaError] = useState<string>('')
    const [captchaError, setCaptchaError] = useState<boolean>(false)
    const modal = useModalDialog()
    const lang = useLang()
    const clientId = useClientId()

    const onConfirmCancel = useCallback(() => setConfirm(false), [isConfirm, setConfirm])

    const onTextChange = useCallback((text) => {
        setTextValue(text)
        if (textareaError && text !== 0) {
            setTextareaError('')
        }
    }, [textareaError, textValue, setTextValue])

    const onCloseClick = useCallback(() => {
        if (!isConfirm && textValue.length !== 0) {
            return setConfirm(true)
        } else {
            dispatch(hideModalDialog())
        }
    }, [dispatch, textValue, isConfirm, setConfirm])

    const onTextareaBlur = useCallback(() => {
        if (textValue.length === 0) {
            setTextareaError(t('wordErrorEmptyTextValidation'))
        }
    }, [textValue])

    useEffect(() => {
        if (online) {
            loadCaptchaScript().then(() => (
                grecaptcha.render('#recaptcha-element', {
                    sitekey: captchaSiteKey,
                    theme: 'light',
                    callback: (token) => {
                        setCaptchaToken(token)
                        setCaptchaError(false)
                    },
                })
            ))
        }
    }, [])

    const onSendClick = useCallback(() => {
        if (captchaToken && textValue) {
            setLoader(true)
            const bodyData = {
                ...modal.data,
                lang: `${lang.from}-${lang.to}`,
                clientId,
                errorType,
                text: textValue,
                captchaToken,
            }

            const fetchOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            }

            fetch('https://interslavic-dictionary.com/api/word-error', fetchOptions)
                .then((res) => {
                    if (res.status !== 200) {
                        return Promise.reject(res.status)
                    }

                    return res.json()
                })
                .then(() => {
                    dispatch(hideModalDialog())
                    dispatch(setNotificationAction({
                        text: t('wordErrorSent'),
                    }))
                })
                .catch(() => {
                    dispatch(hideModalDialog())
                    dispatch(setNotificationAction({
                        text: t('wordErrorSentRejected'),
                        type: 'error',
                    }))
                })
            
        } else {
            if (!textValue) {
                setTextareaError(t('wordErrorEmptyTextValidation'))
            }

            if (!captchaToken) {
                setCaptchaError(true)
            }

            setFirstSubmit(false)
        }
    }, [dispatch, captchaToken, modal.data, setLoader, isLoading, textValue, captchaToken])

    const options = wordErrorsTypes.map((value) => ({
        name: t(`${value}ErrorType`),
        value,
    }))

    return (
        <>
            {!online && (
                <OfflinePlaceholder
                    className="word-error-dialog-offline"
                    onClick={onCloseClick}
                />
            )}
            {isConfirm && (
                <div
                    className="word-error-dialog-confirm"
                >
                    <Confirm
                        text={t('sendErrorConfirmExit')}
                        okText={t('yes')}
                        cancelText={t('no')}
                        onCancel={onConfirmCancel}
                        onConfirm={onCloseClick}
                    />
                </div>
            )}
            {isLoading && (
                <div className="modal-loader">
                    <Spinner
                        size="4rem"
                        borderWidth=".3em"
                    />
                </div>
            )}
            <div className="word-error-dialog__header">
                <div className="word-error-dialog__header-title">
                    {t('wordErrorModalTitle')}
                </div>
                <button
                    className="word-error-dialog__header-close"
                    onClick={onCloseClick}
                    aria-label="Close"
                >
                    &times;
                </button>
            </div>
            <div className="word-error-dialog__body">
                <p>
                    {t('wordErrorInfo')}
                </p>
                <Selector
                    className="word-error-dialog__body-selector"
                    options={options}
                    onSelect={setErrorType}
                    value={errorType}
                />
                <Textarea
                    value={textValue}
                    onChange={onTextChange}
                    maxLength={wordErrorTextMaxLength}
                    error={textareaError}
                    className="word-error-dialog__body-text"
                    onBlur={onTextareaBlur}
                />
                <div className="word-error-dialog__body-recaptcha">
                    {captchaError && <p className="word-error-dialog__body-recaptcha-error">{t('captchaError')}</p>}
                    <div id="recaptcha-element"/>
                </div>
            </div>
            <footer className="word-error-dialog__footer">
                <Button
                    onClick={onCloseClick}
                    size="L"
                    title={t('cancelWordError')}
                    fill={false}
                />
                <Button
                    onClick={onSendClick}
                    size="L"
                    title={t('sendWordError')}
                    disabled={!firstSubmit && (textValue.length === 0 || captchaToken.length === 0)}
                />
            </footer>
        </>
    )
}
