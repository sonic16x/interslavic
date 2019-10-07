import * as React from 'react';
import { initDictionary } from 'utils/translator';
import { Header } from './components/Header';
import { InfoPage } from './components/InfoPage';
import { LangSelect } from './components/LangSelect';
import { LineSelector } from './components/LineSelector';
import { Loader } from './components/Loader';
import { Results } from './components/Results';
import { Selector } from './components/Selector';
import './index.scss';

interface IMainState {
    from: string;
    to: string;
    fromText: string;
    searchType: string;
    flavorisationType: string;
    info: boolean;
    scientific: boolean;
    isLoading: boolean;
}

const searchTypes = [
    {
        name: 'Entire',
        value: 'full',
    },
    {
        name: 'Begin',
        value: 'begin',
    },
    {
        name: 'Any',
        value: 'some',
    },
];

const flavorisationTypes = [
    {
        name: 'Naučny MS',
        value: '2',
    },
    {
        name: 'Medžuslovjansky',
        value: '3',
    },
    {
        name: 'Slovianto',
        value: '4',
    },
    {
        name: 'Sěverny variant',
        value: 'S',
    },
    {
        name: 'Južny variant',
        value: 'J',
    },
];

const wordsListUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSwmAFvs2FmTYZfaS6VMe3X0VbvuKCs5F94YbvcyRfD070GZ0eNvYZAZXoPuZyT4s6Wqho2wyVzeeeu/pub?gid=1987833874&single=true&output=tsv';

export class Main extends React.Component<{}, IMainState> {
    constructor(props) {
        super(props);
        this.state = {
            from: 'en',
            to: 'isv',
            fromText: '',
            searchType: 'full',
            flavorisationType: '3',
            info: false,
            scientific: false,
            isLoading: true,
        };
        this.loadWordsList();
    }
    private loadWordsList() {
        fetch(wordsListUrl)
            .then((res) => res.text())
            .then((data) => {
                const wordList = data.split('\n').map((l) => l.split('\t'));
                this.setState({isLoading: false});
                initDictionary(wordList);
            });
    }
    public render() {
        if (this.state.isLoading) {
            return <Loader title={'Loading dictionary'}/>;
        }
        return (
            <>
                {this.state.info ? <InfoPage onClose={() => this.setState({info: false})}/> : ''}
                <Header showInfo={() => this.setState({info: true})}/>
                <div className={'container shadow'}>
                    <br/>
                    <LangSelect
                        from={this.state.from}
                        to={this.state.to}
                        onSelect={(from, to) => this.setState({from, to})}
                    />
                    <br/>
                    <LineSelector
                        options={searchTypes}
                        value={this.state.searchType}
                        onSelect={(searchType) => this.setState({searchType})}
                    />
                    <br/>
                    <div className={'input-group input-group-lg'}>
                        <input
                            placeholder={'Type word here'}
                            type={'text'}
                            className={'form-control'}
                            onChange={(e) => this.setState({fromText: e.target.value})}
                        />
                    </div>
                    <br/>
                    <div className={'flav'}>
                        <label>Flavorisation</label>
                        <Selector
                            options={flavorisationTypes}
                            onSelect={(flavorisationType) => this.setState({flavorisationType})}
                            value={this.state.flavorisationType}
                        />
                    </div>
                </div>
                <Results
                    text={this.state.fromText}
                    from={this.state.from}
                    to={this.state.to}
                    searchType={this.state.searchType}
                    flavorisationType={this.state.flavorisationType}
                />
            </>
        );
    }
}
