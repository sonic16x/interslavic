import * as React from 'react';
import { connect } from 'react-redux';
import { ITranslateResult } from 'utils/translator';
import './index.scss';
import { showDetailAction } from 'actions';

interface IResultsProps {
    results: ITranslateResult[];
    showDetail: (itemIndex: number) => void;
    lang: {
        from: string;
        to: string;
    };
}

class Results extends React.Component<IResultsProps> {
    public renderResultItem(item: ITranslateResult, i: number) {
        return (
            <div className={'card resultCard shadow'} key={i} onClick={() => this.props.showDetail(i)}>
                {this.renderCheked(item)}
                <div className={'card-body'}>
                    <h5 className={'card-title'}>
                        {this.renderTranslate(item)}&nbsp;{this.renderIpa(item)}
                    </h5>
                    <h6 className={'card-subtitle mb-2 text-muted'}>{item.pos}</h6>
                    <p className={'card-text'}>{this.renderOriginal(item)}</p>
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
    private renderCheked({checked}) {
        if (checked) {
            return <span className={'badge checked shadow badge-success'}>Verified</span>;
        } else {
            return <span className={'badge checked shadow badge-danger'}>Auto-translation</span>;
        }
    }
    private renderOriginal(item) {
        let latin = item.original;
        if (item.originalAdd) {
            latin += ` ${item.originalAdd}`;
        }
        let cyrillic = item.originalCyrillic;
        if (item.originalAddCyrillic) {
            cyrillic += ` ${item.originalAddCyrillic}`;
        }
        // let gla = item.originalGla;
        // if (item.originalAddGla) {
        //     gla += ` ${item.originalAddGla}`;
        // }
        return [latin, cyrillic].filter(Boolean).join('/');
    }
    private renderTranslate(item) {
        let latin = item.translate;
        if (item.add) {
            latin += ` ${item.add}`;
        }
        let cyrillic = item.translateCyrillic;
        if (item.addCyrillic) {
            cyrillic += ` ${item.addCyrillic}`;
        }
        // let gla = item.translateGla;
        // if (item.addGla) {
        //     gla += ` ${item.addGla}`;
        // }
        return [latin, cyrillic].filter(Boolean).join('/');
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
        showDetail: (i) => dispatch(showDetailAction(i)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Results);
