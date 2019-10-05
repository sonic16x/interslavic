import * as React from 'react';
import { transalte } from 'utils/translator';
import './index.scss';

interface IResultsProps {
    text: string;
    language: string;
    searchType: string;
    spellingType: string;
}

export class Results extends React.Component<IResultsProps> {
    public render() {
        const { text, language, searchType, spellingType } = this.props;
        if (!text) {
            return '';
        }
        const results = transalte(text, language, searchType, spellingType);
        return (
            <div className={'results'}>
                {results.map((item: any, i) => {
                    return (
                        <div className={'card resultCard shadow'} key={i}>
                            <div className={'card-body'}>
                                <h5 className={'card-title'}>
                                    {item.translate}{item.add ? ` ${item.add}` : ''}&nbsp;{this.renderIpa(item)}
                                </h5>
                                <h6 className={'card-subtitle mb-2 text-muted'}>{item.pos}</h6>
                                {item.original ? <p className={'card-text'}>{item.original}</p> : ''}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
    private renderIpa(item) {
        if (item.ipa) {
            return <span className={'text-muted'}>[{item.ipa}]</span>;
        }
        return '';
    }
}
