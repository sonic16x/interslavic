import classNames from 'classnames'
import { useDispatch } from 'react-redux'

import { t } from 'translations'

import { setNotificationAction } from 'actions'

import './Clipboard.scss'

interface IClipboardProps {
    str: string;
    className?: string;
    lang?: string;
}

export const Clipboard =
    ({ str, className, lang }: IClipboardProps) => {
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
                className={classNames('clipboard', className)}
                lang={lang}
            >
                {str}
            </span>
        )
    }
