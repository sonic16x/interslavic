import { setAlphabetTypeAction, hideModalDialog } from 'actions';
import Table from 'components/Table';
import * as React from 'react';
import { connect } from 'react-redux';
import { t } from 'translations';
import './index.scss';
import { langs } from 'consts';
import { validFields } from 'utils/dictionary';
import { getLatin } from 'utils/getLatin';
import { getCyrillic } from 'utils/getCyrillic';
import { IMainState } from 'reducers';

interface ITranslationsModalInternalProps {
    close: () => void;
    item: any;
    alphabets: any;
    flavorisationType: string;
}

class TranslationsModalInternal extends React.Component<ITranslationsModalInternalProps> {
    public render() {
        if (!this.props.item) {
            return null;
        }

        return (
            <>
                <div className={'modal-dialog__header'}>
                    <div className={'modal-dialog__header-title'}>
                        {t('translatesModalTitle')}
                    </div>
                    <button
                        className={'modal-dialog__header-close'}
                        onClick={this.props.close}
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
                        `{${t('isvEtymologicLatinLang')}}[B]@ts;b;sw=130px`,
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
}

function mapDispatchToProps(dispatch) {
    return {
        close: () => dispatch(hideModalDialog()),
        setAlphabetType: (type) => dispatch(setAlphabetTypeAction(type)),
    };
}

function mapStateToProps({results, flavorisationType, modalDialog, interfaceLang}: IMainState) {
    return {
        item: results[modalDialog.index],
        flavorisationType,
        interfaceLang,
    };
}

export const TranslationsModal = connect(mapStateToProps, mapDispatchToProps)(TranslationsModalInternal);
