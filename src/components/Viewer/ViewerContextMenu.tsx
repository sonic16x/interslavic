import { t } from 'translations';
import { useCallback, useEffect, useRef } from 'react';
import { setNotificationAction, showModalDialog } from 'actions';
import { useDispatch } from 'react-redux';

import './ViewerContextMenu.scss';

import ContextMenuCloseIcon from './images/context-menu-close-icon.svg';
import { Button } from 'components/Button/Button';
import { MODAL_DIALOG_TYPES } from 'reducers';
import { getPartOfSpeech } from 'utils/wordDetails';

export interface IViewerContextMenu {
    position: {
        x: number;
        y: number;
    };
    text: string;
    googleLink: string;
    formsData?: {
        word: string;
        add: string;
        details: string;
    };
    onClose: () => void;
}

export const ViewerContextMenu = ({ position, text, googleLink, onClose, formsData }: IViewerContextMenu) => {
    const dispatch = useDispatch();
    const contextMenuRef = useRef();

    const onClipboardClick = useCallback(() => {
        navigator.clipboard.writeText(text).then(() => {
            const notificationText = t('clipboardCopyNotification', {
                str: text,
            });
            dispatch(setNotificationAction(notificationText));
            onClose();
        });
    }, [text, onClose]);

    const onKeyPress = useCallback(({ code }) => {
        if (code === 'Escape') {
            onClose();
        }
    }, []);

    const onWindowClick = useCallback((event) => {
        // @ts-ignore
        if (!contextMenuRef.current.contains(event.target)) {
            event.stopPropagation();
            onClose();
        }
    }, [contextMenuRef]);

    useEffect(() => {
        window.addEventListener('keyup', onKeyPress);
        window.addEventListener('click', onWindowClick, true);

        return () => {
            window.removeEventListener('keyup', onKeyPress);
            window.removeEventListener('click', onWindowClick, true);
        };
    }, []);

    const showDetail = useCallback(() => {
        dispatch(showModalDialog({
            type: MODAL_DIALOG_TYPES.MODAL_DIALOG_WORD_FORMS,
            data: formsData,
        }));
        onClose();
    }, [formsData]);

    return (
        <div
            className={'context-menu'}
            style={{
                left: position.x,
                top: position.y,
            }}
            ref={contextMenuRef}
        >
            {text && (
                <>
                    <p className={'context-menu__text'}>
                        {text}
                    </p>
                    <Button
                        onClick={onClipboardClick}
                        title={t('viewerCopyToClipboard')}
                    />
                </>
            )}
            <Button
                href={googleLink}
                onClick={onClose}
                target={'_blank'}
                title={t('viewerOpenCeilInGoogleSheets')}
            />
            {formsData && (
                <Button
                    onClick={showDetail}
                    title={getPartOfSpeech(formsData.details) === 'verb' ? t('conjugation') : t('declensions')}
                />
            )}
            {text && (
                <span
                    className={'context-menu__close muted-color cursor-pointer'}
                    onClick={onClose}
                >
                    <ContextMenuCloseIcon/>
                </span>
            )}
        </div>
    );
};
