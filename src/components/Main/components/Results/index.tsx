import * as React from 'react';
import { connect } from 'react-redux';
import { translate } from 'utils/translator';
import './index.scss';

interface IResultsProps {
    text: string;
    from: string;
    to: string;
    flavorisationType: string;
    searchType: string;
}

class Results extends React.Component<IResultsProps> {
    public render() {
        const { text, from, to, searchType, flavorisationType } = this.props;
        if (!text) {
            return '';
        }
        const results = translate(text, from, to, searchType, flavorisationType);

        return (
            <div className={'results'}>
                {results.map((item: any, i) => (
                    <div className={'card resultCard shadow'} key={i}>
                        {this.renderCheked(item)}
                        <div className={'card-body'}>
                            <h5 className={'card-title'}>
                                {this.renderTranslate(item)}&nbsp;{this.renderIpa(item)}
                            </h5>
                            <h6 className={'card-subtitle mb-2 text-muted'}>{item.pos}</h6>
                            {item.original ? <p className={'card-text'}>{this.renderOriginal(item)}</p> : ''}
                        </div>
                    </div>
                ))}
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
        if (latin && cyrillic) {
            return `${latin}/${cyrillic}`;
        }
        return latin;
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
        if (latin && cyrillic) {
            return `${latin}/${cyrillic}`;
        }
        return latin;
    }
    private renderIpa(item) {
        if (item.ipa) {
            return <span className={'text-muted'}>[{item.ipa}]</span>;
        }
        return '';
    }
}

function mapStateToProps({fromText, from, to, flavorisationType, searchType}) {
    return {
        text: fromText,
        from,
        to,
        flavorisationType,
        searchType,
    };
}

export default connect(mapStateToProps)(Results);
