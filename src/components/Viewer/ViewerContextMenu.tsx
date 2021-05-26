import { t } from 'translations';
import { useCallback, useEffect, useRef, useState } from 'react';
import { setNotificationAction, showModalDialog } from 'actions';
import { useDispatch } from 'react-redux';

import './ViewerContextMenu.scss';

import ContextMenuCloseIcon from './images/context-menu-close-icon.svg';
import { Button } from 'components/Button/Button';
import { MODAL_DIALOG_TYPES } from 'reducers';
import { getPartOfSpeech } from 'utils/wordDetails';

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
    const contextMenuRef = useRef();

    useEffect(() => {
        if (buttonRef && contextMenuRef && contextMenuRef.current) {
            // @ts-ignore
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
            style={pos ? pos : { opacity: 0 }}
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
