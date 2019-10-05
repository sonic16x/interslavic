import * as React from 'react';
import './index.scss';
import { Selector } from '../Selector';

interface ILangSelectProps {
    from: string;
    to: string;
    onSelect: (from: string, to: string) => void;
}

interface ILangSelectState {}

const languageList = [
    // {
    //     name: 'Russian',
    //     value: 'ru',
    // },
    {
        name: 'English',
        value: 'en',
    },
];

export class LangSelect extends React.Component<ILangSelectProps, ILangSelectState> {
    private renderLangPart(dir: string) {
        const langCode = this.props[dir];
        if (langCode === 'ins') {
            return (
                <div className={'input-group-append langItem ins'}>
                    <label className={'input-group-append input-group-text langItem'}>Interslavic</label>
                </div>
            );
        }
        return (
            <div className={'input-group-append langItem'}>
                <Selector
                    options={languageList}
                    value={langCode}
                    onSelect={(langCode: string) => {
                        if (dir === 'from') {
                            this.props.onSelect(langCode, this.props.to);
                        }
                        if (dir === 'to') {
                            this.props.onSelect(this.props.from, langCode);
                        }
                    }}/>
            </div>
        );
    }
    public render() {
        return (
            <div className={'input-group langSelect'}>
                {this.renderLangPart('from')}
                <div className={'input-group-append langItem changeDir'}>
                    <button
                        type={'button'}
                        style={{textDecoration: 'none'}}
                        className={'btn btn-link changeLang'}
                        // onClick={() => this.setState({from: this.state.to, to: this.state.from})}
                        onClick={() => this.props.onSelect(this.props.to, this.props.from)}
                    >⇄</button>
                </div>
                {this.renderLangPart('to')}
            </div>
        );
    }
}