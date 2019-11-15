import * as React from 'react';
import { connect } from 'react-redux';
import { ITranslateResult, removeBrackets } from 'utils/translator';
import './index.scss';
import { setDetailAction, showDetailAction } from 'actions';
import { getPartOfSpeech } from 'utils/wordDetails';

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

        return (
            <div className={'results'}>
                {results.map((item: ITranslateResult, i) => this.renderResultItem(item, i))}
            </div>
        );
    }
    private renderFormsButton(item, i) {
        const pos = getPartOfSpeech(item.details);
        switch (pos) {
            case 'noun':
            case 'numeral':
            case 'pronoun':
                if (item.original.match(/[^,] [^\[]/)) { return ''; }
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
                        Show forms
                    </button>
                );
            default:
                return '';
        }
    }
    private renderCheked({checked}) {
        if (checked) {
            return <span className={'badge checked shadow badge-success'}>Verified</span>;
        } else {
            return <span className={'badge checked shadow badge-danger'}>Auto-translation</span>;
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
