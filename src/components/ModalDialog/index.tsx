import { useCallback, useEffect } from 'react';
import './index.scss';
import { MODAL_DIALOG_TYPES } from 'reducers';
import { DetailModal } from 'components/DetailModal';
import { TranslationsModal } from 'components/TranslationsModal';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { hideModalDialog } from 'actions';
import { useModalDialog } from 'hooks/useModalDialog';

function getModalDialog(type: MODAL_DIALOG_TYPES) {
    switch (type) {
        case MODAL_DIALOG_TYPES.MODAL_DIALOG_TRANSLATION:
            return <TranslationsModal />;
        case MODAL_DIALOG_TYPES.MODAL_DIALOG_WORD_FORMS:
            return <DetailModal />;
        default:
            return null;
    }
}

export const ModalDialog =
    () => {
        const { type, show } = useModalDialog();
        const content = show ? getModalDialog(type) : null;
        const dispatch = useDispatch();
        const onKeyPress = useCallback(({code}) => {
            if (code === 'Escape') {
                dispatch(hideModalDialog());
            }
        }, [dispatch]);
        const onBackdropClick = useCallback(() => {
            dispatch(hideModalDialog());
        }, [dispatch]);

        useEffect(() => {
            window.addEventListener('keyup', onKeyPress);

            return () => {
                window.removeEventListener('keyup', onKeyPress);
            };
        }, []);

        return (
            <div className={classNames('modal-dialog-container', {show})}>
                <div className={'modal-dialog-back'} onClick={onBackdropClick}/>
                <div className={'modal-dialog'}>
                    {content}
                </div>
            </div>
        );
    };
