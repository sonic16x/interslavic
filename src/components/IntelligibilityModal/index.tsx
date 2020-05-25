import { hideModalDialog } from 'actions';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { t } from 'translations';
import './index.scss';
import { useResults } from 'hooks/useResults';
import { useInterfaceLang } from 'hooks/useInterfaceLang';
import { useModalDialog } from 'hooks/useModalDialog';

function renderTranslate(str: string): string {
    if (str[0] === '!') {
        return `{${str.slice(1)}}[s]@ts;`;
    }
    return `{✓}[g] ${str}@ts`;
}

export const IntelligibilityModal: React.FC =
    () => {
        const results = useResults();
        const dispatch = useDispatch();
        const modalDialog = useModalDialog();
        useInterfaceLang();

        const item = results[modalDialog.index];

        const onClick = React.useCallback(() => {
            dispatch(hideModalDialog());
        }, [dispatch]);

        return (
            <>
                <div className={'modal-dialog__header'}>
                    <div className={'modal-dialog__header-title'}>
                        {t('translatesModalTitle')}
                    </div>
                    <button
                        className={'modal-dialog__header-close'}
                        onClick={onClick}
                        aria-label={'Close'}
                    >
                        &times;
                    </button>
                </div>
                <div className={'modal-dialog__body'}>
                    Hello, world!
                </div>
            </>
        );
    };
