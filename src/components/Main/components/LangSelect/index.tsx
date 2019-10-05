import * as React from 'react';
import { Selector } from '../Selector';
import './index.scss';

interface ILangSelectProps {
    from: string;
    to: string;
    onSelect: (from: string, to: string) => void;
}

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

export class LangSelect extends React.Component<ILangSelectProps> {
    public render() {
        return (
            <div className={'input-group langSelect'}>
                {this.renderLangPart('from')}
                <div className={'input-group-append langItem changeDir'}>
                    <button
                        type={'button'}
                        style={{textDecoration: 'none'}}
                        className={'btn btn-link changeLang'}
                        onClick={() => this.props.onSelect(this.props.to, this.props.from)}
                    >
                        ⇄
                    </button>
                </div>
                {this.renderLangPart('to')}
            </div>
        );
    }
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
                    }}
                />
            </div>
        );
    }
}
