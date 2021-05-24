import { t } from 'translations';
import { useCallback, useEffect, useRef } from 'react';
import { setNotificationAction } from 'actions';
import { useDispatch } from 'react-redux';

import './ViewerContextMenu.scss';

import ContextMenuCloseIcon from './images/context-menu-close-icon.svg';

export interface IViewerContextMenu {
    position: {
        x: number;
        y: number;
    };
    text: string;
    googleLink: string;
    onClose: () => void;
}

export const ViewerContextMenu = ({ position, text, googleLink, onClose }: IViewerContextMenu) => {
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
                    <button
                        className={'context-menu__item button button-m'}
                        onClick={onClipboardClick}
                    >
                        {t('viewerCopyToClipboard')}
                    </button>
                </>
            )}
            <a
                className={'context-menu__item button button-m'}
                href={googleLink}
                onClick={onClose}
                target={'_blank'}
            >
                {t('viewerOpenCeilInGoogleSheets')}
            </a>
            <span
                className={'context-menu__close muted-color cursor-pointer'}
                onClick={onClose}
            >
                <ContextMenuCloseIcon/>
            </span>
        </div>
    );
};
