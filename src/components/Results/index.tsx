import * as React from 'react';
import { connect } from 'connect';
import { Dictionary, ITranslateResult } from 'utils/dictionary';
import './index.scss';
import { setDetailAction, showDetailAction } from 'actions';
import { getPartOfSpeech } from 'utils/wordDetails';
import { worksheetUrl } from 'consts';
import { t } from 'translations';

interface IResultsProps {
    results: ITranslateResult[];
    showDetail: () => void;
    setDetail: (itemIndex: number) => void;
    lang: {
        from: string;
        to: string;
    };
}

class Results extends React.Component<IResultsProps> {
    public renderResultItem(item: ITranslateResult, i: number) {
        return (
            <div className={'card resultCard shadow'} tabIndex={0} key={i}>
                {this.renderCheked(item)}
                {this.renderFormsButton(item, i)}
                <div className={'card-body'}>
                    <h5 className={'card-title'}>
                        {this.props.lang.to === 'isv' ?
                            <>{this.renderOriginal(item)}&nbsp;{this.renderIpa(item)}</> :
                            <>{this.renderTranslate(item)}</>
                        }
                    </h5>
                    <h6 className={'card-subtitle mb-2 text-muted'}>{item.details}</h6>
                    <p className={'card-text'}>
                        {this.props.lang.to === 'isv' ?
                            <>{this.renderTranslate(item)}</> :
                            <>{this.renderOriginal(item)}&nbsp;{this.renderIpa(item)}</>
                        }
                    </p>
                </div>
            </div>
        );
    }
    public render() {
        const { results } = this.props;
        if (!results || !results.length) {
            return '';
        }

        const lang = this.props.lang.from === 'isv' ? this.props.lang.to : this.props.lang.from;

        return (
            <div className={'results'}>
                <>{results.map((item: ITranslateResult, i) => this.renderResultItem(item, i))}</>
                {results.some((item) => !item.checked) &&
                <div className={'messageForUser'}>
                    Search results contain inaccurate automatic translations. Currently,{' '}
                    {Dictionary.getPercentsOfTranslated()[lang]}% of the words of the selected language{' '}
                    are verified. If you speak this language, join the work on improving translations!{' '}
                    <a target={'_blank'} href={worksheetUrl}>The worksheet is located at this link.</a>
                </div> }
            </div>
        );
    }
    private renderFormsButton(item, i) {
        const pos = getPartOfSpeech(item.details);
        switch (pos) {
            case 'noun':
            case 'numeral':
            case 'pronoun':
                if (item.original.includes(' ') && item.original.match(/[^,] [^\[]/)) { return ''; }
            case 'adjective':
            case 'verb':
                return (
                    <button
                        type={'button'}
                        aria-label={'Show forms'}
                        className={'btn btn-sm btn-link showForms'}
                        onClick={() => {
                            this.props.setDetail(i);
                            this.props.showDetail();
                        }}
                    >
                        {t('showForms')}
                    </button>
                );
            default:
                return '';
        }
    }
    private renderCheked({checked}) {
        if (checked) {
            return <span className={'badge checked shadow badge-success'}>{t('verified')}</span>;
        } else {
            return <span className={'badge checked shadow badge-danger'}>{t('autoTranslation')}</span>;
        }
    }
    private renderOriginal(item) {
        let latin = item.original;
        if (item.add) {
            latin += ` ${item.add}`;
        }
        let cyrillic = item.originalCyr;
        if (item.addCyr) {
            cyrillic += ` ${item.addCyr}`;
        }
        // let gla = item.originalGla;
        // if (item.addGla) {
        //     gla += ` ${item.addGla}`;
        // }
        return [latin, cyrillic].filter(Boolean).join('/');
    }
    private renderTranslate(item) {
        return item.translate;
    }
    private renderIpa(item) {
        if (item.ipa) {
            return <span className={'text-muted'}>[{item.ipa}]</span>;
        }
        return '';
    }
}

function mapStateToProps({results, lang}) {
    return { results, lang };
}

function mapDispatchToProps(dispatch) {
    return {
        setDetail: (i) => dispatch(setDetailAction(i)),
        showDetail: () => dispatch(showDetailAction()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Results);
