import * as React from 'react';
import './index.scss';
import { connect } from 'react-redux';
import { IMainState, MODAL_DIALOG_TYPES } from 'reducers';
import { DetailModal } from 'components/DetailModal';
import { TranslationsModal } from 'components/TranslationsModal';
import classNames from 'classnames';

interface IModalDialogInternalProps {
    type: MODAL_DIALOG_TYPES;
    index: number;
    show: boolean;
}

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

const ModalDialogInternal: React.FC<IModalDialogInternalProps> =
    ({type, show}: IModalDialogInternalProps) => {
        const content = getModalDialog(type);

        return (
            <div className={classNames('modal-dialog-container', {show})}>
                <div className={'modal-dialog-back'} />
                <div className={'modal-dialog'}>
                    {content}
                </div>
            </div>
        );
    };

function mapStateToProps({modalDialog}: IMainState) {
    return { ...modalDialog };
}

export const ModalDialog = connect(mapStateToProps, null)(ModalDialogInternal);
