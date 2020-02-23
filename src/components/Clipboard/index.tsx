import * as React from 'react';
import { useDispatch } from 'react-redux';
import { setNotificationAction } from 'actions';
import { t } from 'translations';
import './index.scss';
import classNames from 'classnames';

interface IClipboardProps {
    str: string;
    className?: string;
}

export const Clipboard: React.FC<IClipboardProps> =
    ({str, className}: IClipboardProps) => {
        const dispatch = useDispatch();
        const onClick = React.useCallback(() => {
            navigator.clipboard.writeText(str).then(() => {
                const notificationText = t('clipboardCopyNotification', {str});
                dispatch(setNotificationAction(notificationText));
            });
        }, [str]);

        return (
            <span
                onClick={onClick}
                className={classNames('clipboard', className)}
            >
                {str}
            </span>
        );
    };
