import * as React from 'react';
import { useDispatch } from 'react-redux';
import { setNotificationAction } from 'actions';
import { t } from 'translations';
import './index.scss';
import classNames from 'classnames';
import biReporter from 'utils/biReporter';
import { Dictionary, ITranslateResult } from 'utils/dictionary';

interface IClipboardProps {
    str: string;
    index?: number;
    type?: 'card' | 'modal';
    className?: string;
    item?: ITranslateResult;
    lang?: string;
}

export const Clipboard: React.FC<IClipboardProps> =
    ({str, className, index, type, item, lang}: IClipboardProps) => {
        const dispatch = useDispatch();
        const onClick = React.useCallback(() => {
            navigator.clipboard.writeText(str).then(() => {
                const notificationText = t('clipboardCopyNotification', {str});
                dispatch(setNotificationAction(notificationText));
            });

            // NOTE: Google Analytics.
            if (type && typeof index !== 'undefined') {
                const id = Dictionary.getField(item.raw, 'id').toString();

                if (type === 'card') {
                    biReporter.clipboardCard(
                        str,
                        id,
                        index,
                        item.raw[0],
                        lang,
                    );
                }
                if (type === 'modal') {
                    biReporter.clipboardModal(
                        str,
                        id,
                        index,
                        item.raw[0],
                        lang,
                    );
                }
            }

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
