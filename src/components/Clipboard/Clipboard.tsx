import classNames from 'classnames'
import { useDispatch } from 'react-redux'

import { t } from 'translations'

import { setNotificationAction } from 'actions'

import './Clipboard.scss'

interface IClipboardProps {
    str: string;
    className?: string;
    lang?: string;
    /** Tab and Enter copy too; a table turns it off, or its forms would be dozens of tab stops */
    keyboard?: boolean;
}

export const Clipboard =
    ({ str, className, lang, keyboard = true }: IClipboardProps) => {
        const dispatch = useDispatch()
        const onClick = () => {
            navigator.clipboard.writeText(str).then(() => {
                const notificationText = t('clipboardCopyNotification', { str })
                dispatch(setNotificationAction({ text: notificationText }))
            })
        }

        return (
            <span
                onClick={onClick}
                role={keyboard ? 'button' : undefined}
                tabIndex={keyboard ? 0 : undefined}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onClick()
                    }
                }}
                className={classNames('clipboard', className)}
                lang={lang}
            >
                {str}
            </span>
        )
    }
