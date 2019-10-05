import * as React from 'react';
import { transalte } from 'utils/translator';
import './index.scss';

interface IResultsProps {
    text: string;
    from: string;
    to: string;
    searchType: string;
}

export class Results extends React.Component<IResultsProps> {
    public render() {
        const { text, from, to, searchType } = this.props;
        if (!text) {
            return '';
        }
        const results = transalte(text, from, to, searchType);
        return (
            <div className={'results'}>
                {results.map((item: any, i) => {
                    return (
                        <div className={'card resultCard shadow'} key={i}>
                            <div className={'card-body'}>
                                <h5 className={'card-title'}>
                                    {this.renderTranslate(item)}&nbsp;{this.renderIpa(item)}
                                </h5>
                                <h6 className={'card-subtitle mb-2 text-muted'}>{item.pos}</h6>
                                {item.original ? <p className={'card-text'}>{this.renderOriginal(item)}</p> : ''}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
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
