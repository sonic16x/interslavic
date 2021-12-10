import classNames from 'classnames';
import { useDispatch } from 'react-redux';

import { t } from 'translations';

import { setNotificationAction } from 'actions';

import { biReporter, IClipboardAnalytics } from 'services/biReporter';
import { Dictionary, ITranslateResult } from 'services/dictionary';

import './Clipboard.scss';

interface IClipboardProps {
    str: string;
    index?: number;
    type?: 'card' | 'modal';
    className?: string;
    item?: ITranslateResult;
    lang?: string;
}

export const Clipboard =
    ({ str, className, index, type, item, lang }: IClipboardProps) => {
        const dispatch = useDispatch();
        const onClick = () => {
            navigator.clipboard.writeText(str).then(() => {
                const notificationText = t('clipboardCopyNotification', { str });
                dispatch(setNotificationAction(notificationText));
            });

            // NOTE: Google Analytics.
            if (type && typeof index !== 'undefined') {
                const id = Dictionary.getField(item.raw, 'id').toString();

                const clipboardDetails: IClipboardAnalytics = {
                    checked: item.checked,
                    wordId: id,
                    isv: Dictionary.getField(item.raw, 'isv'),
                    content: str,
                    index,
                    lang,
                };

                if (type === 'card') {
                    biReporter.clipboardCard(clipboardDetails);
                }
                if (type === 'modal') {
                    biReporter.clipboardModal(clipboardDetails);
                }
            }
        };

        return (
            <span
                onClick={onClick}
                className={classNames('clipboard', className)}
            >
                {str}
            </span>
        );
    };
