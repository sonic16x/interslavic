import { hideTranslationsAction, setAlphabetTypeAction } from 'actions';
import Table from 'components/Table';
import * as React from 'react';
import { connect } from 'react-redux';
import { t } from 'translations';
import ModalDialog from '../ModalDialog';
import './index.scss';
import { langs } from 'consts';
import { validFields } from 'utils/dictionary';
import { getLatin } from 'utils/getLatin';
import { getCyrillic } from 'utils/getCyrillic';

interface ITranslationsModalInternalProps {
    close: () => void;
    item: any;
    alphabets: any;
    isTranslationsModal: boolean;
    flavorisationType: string;
}

class TranslationsModalInternal extends React.Component<ITranslationsModalInternalProps> {
    private closeButtonRef = React.createRef<HTMLButtonElement>();

    public render() {
        const contents = this.renderContents();

        return (
            <ModalDialog
                wrapperClassName={'modal-content'}
                open={!!contents}
                onOpen={this.onDialogOpened}
                onClose={this.close}
            >
                {contents}
            </ModalDialog>
        );
    }

    private renderContents() {
        if (!this.props.item || !this.props.isTranslationsModal) {
            return null;
        }

        return (
            <>
                <div className={'modal-dialog__header'}>
                    <div className={'modal-dialog__header-title'}>
                        {t('translatesModalTitle')}
                    </div>
                    <button
                        ref={this.closeButtonRef}
                        className={'modal-dialog__header-close'}
                        onClick={this.close}
                        aria-label={'Close'}
                    >
                        &times;
                    </button>
                </div>
                <div className={'modal-dialog__body'}>
                    {this.renderBody()}
                </div>
                <footer className={'modal-dialog__footer'}>
                    {t('translationsBottomText')}
                    <br/>
                    {t('aboutJoinText')}
                </footer>
            </>
        );
    }

    private renderTranslate(str: string): string {
        if (str[0] === '!') {
            return `{${str.slice(1)}}[s]@ts;`;
        }
        return `{✓}[g] ${str}@ts`;
    }

    private renderBody() {
        const allLangs = [
            'isv',
            'en',
            ...langs,
        ];
        const translates = this.props.item.raw.filter((_, i) => (allLangs.includes(validFields[i])));
        const tableData = allLangs.reduce((arr, lang, i) => {
            if (lang === 'isv') {
                return [
                    [
                        `{${t('isvEtymologicLatinLang')}}[B]@ts;b;sw=120px`,
                        `${getLatin(translates[i], '2')}@ts`,
                    ],
                    [
                        `{${t('isvLatinLang')}}[B]@ts;b`,
                        `${getLatin(translates[i], '3')}@ts`,
                    ],
                    [
                        `{${t('isvCyrillicLang')}}[B]@ts;b`,
                        `${getCyrillic(translates[i], '3')}@ts`,
                    ],
                    [
                        `@w=2;S`,
                    ],
                ];
            }

            return [
                ...arr,
                [
                    `{${t(`${lang}Lang`)}}[B]@ts;b`,
                    this.renderTranslate(translates[i]),
                ],
            ];
        }, []);
        return <Table data={tableData} />;
    }

    private onDialogOpened = () => {
        const closeButton = this.closeButtonRef.current;
        if (closeButton) {
            closeButton.blur();
        }
    }

    private close = () => {
        this.props.close();
    }
}

function mapDispatchToProps(dispatch) {
    return {
        close: () => dispatch(hideTranslationsAction()),
        setAlphabetType: (type) => dispatch(setAlphabetTypeAction(type)),
    };
}

function mapStateToProps({translationsModal, results, isTranslationsModal, flavorisationType}) {
    return {
        item: results[translationsModal],
        isTranslationsModal,
        flavorisationType,
    };
}

export const TranslationsModal = connect(mapStateToProps, mapDispatchToProps)(TranslationsModalInternal);
