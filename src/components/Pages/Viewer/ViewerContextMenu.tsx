import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { t } from 'translations';

import { setNotificationAction, showModalDialog } from 'actions';
import { MODAL_DIALOG_TYPES } from 'reducers';

import { getPartOfSpeech } from 'utils/wordDetails';

import { Button } from 'components/Button';

import './ViewerContextMenu.scss';

import ContextMenuCloseIcon from './images/context-menu-close-icon.svg';

export interface IViewerContextMenu {
    buttonRef: HTMLElement;
    text: string;
    googleLink: string;
    formsData?: {
        word: string;
        add: string;
        details: string;
    };
    onClose: () => void;
}

export const ViewerContextMenu = ({ buttonRef, text, googleLink, onClose, formsData }: IViewerContextMenu) => {
    const dispatch = useDispatch();
    const [pos, setPos] = useState<{left: number, top: number}>(null);
    const contextMenuRef = useRef<HTMLDivElement>();

    useEffect(() => {
        if (buttonRef && contextMenuRef && contextMenuRef.current) {
            const contextBox = contextMenuRef.current.getBoundingClientRect();
            const box = buttonRef.getBoundingClientRect();
            const windowHeight = document.body.clientHeight;
            const isBottom = box.y + box.height + contextBox.height > windowHeight;

            setPos({
                left: box.x,
                top: isBottom ? box.y - contextBox.height - box.height * 2.1 : box.y - box.height,
            });
        }
    }, [buttonRef, contextMenuRef]);

    const onClipboardClick = useCallback(() => {
        navigator.clipboard.writeText(text).then(() => {
            const notificationText = t('clipboardCopyNotification', {
                str: text,
            });
            dispatch(setNotificationAction({ text: notificationText }));
            onClose();
        });
    }, [text, onClose, dispatch]);

    const onKeyPress = useCallback(({ code }) => {
        if (code === 'Escape') {
            onClose();
        }
    }, [onClose]);

    const onWindowClick = useCallback((event) => {
        if (!contextMenuRef.current.contains(event.target)) {
            event.stopPropagation();
            onClose();
        }
    }, [contextMenuRef, onClose]);

    useEffect(() => {
        window.addEventListener('keyup', onKeyPress);
        window.addEventListener('click', onWindowClick, true);

        return () => {
            window.removeEventListener('keyup', onKeyPress);
            window.removeEventListener('click', onWindowClick, true);
        };
    }, [onKeyPress, onWindowClick]);

    const showDetail = useCallback(() => {
        dispatch(showModalDialog({
            type: MODAL_DIALOG_TYPES.MODAL_DIALOG_WORD_FORMS,
            data: formsData,
        }));
        onClose();
    }, [formsData, dispatch, onClose]);

    return (
        <div
            className="context-menu"
            style={pos ? pos : { opacity: 0 }}
            ref={contextMenuRef}
        >
            {text && (
                <>
                    <p className="context-menu__text">
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
                target="_blank"
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
                    className="context-menu__close muted-color cursor-pointer"
                    onClick={onClose}
                >
                    <ContextMenuCloseIcon/>
                </span>
            )}
        </div>
    );
};
