import * as React from 'react';
import './index.scss';
import { connect } from 'react-redux';
import { setInterfaceLang, changeIsvSearchLetters } from 'actions';
import { Selector } from 'components/Selector';
import { t } from 'translations';
import { Checkbox } from '../Checkbox';

interface ISettingsProps {
    interfaceLang: string;
    setInterfaceLang: (data: string) => void;
    isvSearchLetters: { from: string[], to: string[] };
    changeIsvSearchLetters: (letters: string) => void;
}

const interfaceLanguageList = [
    {
        name: 'English',
        value: 'en',
    },
    {
        name: 'Medžuslovjansky',
        value: 'isv-Latn',
    },
    {
        name: 'Меджусловјанскы',
        value: 'isv-Cyrl',
    },
    {
        name: 'Русский',
        value: 'ru',
    },
    {
        name: 'Українська',
        value: 'uk',
    },
    {
        name: 'Беларуская',
        value: 'be',
    },
    {
        name: 'Polski',
        value: 'pl',
    },
    {
        name: 'Česky',
        value: 'cs',
    },
    {
        name: 'Slovenský',
        value: 'sk',
    },
    {
        name: 'Slovenščina',
        value: 'sl',
    },
    {
        name: 'Hrvatski',
        value: 'hr',
    },
    {
        name: 'Српски',
        value: 'sr',
    },
    {
        name: 'Македонски',
        value: 'mk',
    },
    {
        name: 'Български',
        value: 'bg',
    },
];

class Settings extends React.Component<ISettingsProps> {
    constructor(props) {
        super(props);
        this.state = {};
    }
    public render() {
        return (
            <div className={'settings'}>
                <div className={'settingsContent'}>
                    <h4>{t('settingsTitle')}</h4>
                    <hr/>
                    <h5>{t('interfaceLanguage')}</h5>
                    <Selector
                        options={interfaceLanguageList}
                        value={this.props.interfaceLang}
                        onSelect={(langCode: string) => this.props.setInterfaceLang(langCode)}
                    />
                    <hr/>
                    <h5>{t('searchSensitiveLettersForInterslavic')}</h5>
                    <div className={'isvSearchLetters'}>
                        <h6>{t('standardOrthography')}</h6>
                        <Checkbox
                            title={'ž š č (ж ш ч)'}
                            checked={this.props.isvSearchLetters.from.includes('ž')}
                            onChange={() => {this.props.changeIsvSearchLetters('žšč'); }}
                        />
                        <Checkbox
                            title={'ě (ѣ)'}
                            checked={this.props.isvSearchLetters.from.includes('ě')}
                            onChange={() => {this.props.changeIsvSearchLetters('ě'); }}
                        />
                        <Checkbox
                            title={'y (ы)'}
                            checked={this.props.isvSearchLetters.from.includes('y')}
                            onChange={() => {this.props.changeIsvSearchLetters('y'); }}
                        />
                        <h6>{t('etymologicalOrthography')}</h6>
                        <Checkbox
                            title={'å'}
                            checked={this.props.isvSearchLetters.from.includes('å')}
                            onChange={() => {this.props.changeIsvSearchLetters('å'); }}
                        />
                        <Checkbox
                            title={'ę ų'}
                            checked={this.props.isvSearchLetters.from.includes('ę')}
                            onChange={() => {this.props.changeIsvSearchLetters('ęų'); }}
                        />
                        <Checkbox
                            title={'ò'}
                            checked={this.props.isvSearchLetters.from.includes('ò')}
                            onChange={() => {this.props.changeIsvSearchLetters('ò'); }}
                        />
                        <Checkbox
                            title={'ŕ'}
                            checked={this.props.isvSearchLetters.from.includes('ŕ')}
                            onChange={() => {this.props.changeIsvSearchLetters('ŕ'); }}
                        />
                        <Checkbox
                            title={'ľ ń'}
                            checked={this.props.isvSearchLetters.from.includes('ľ')}
                            onChange={() => {this.props.changeIsvSearchLetters('ľń'); }}
                        />
                        <Checkbox
                            title={'ť ď'}
                            checked={this.props.isvSearchLetters.from.includes('ť')}
                            onChange={() => {this.props.changeIsvSearchLetters('ťď'); }}
                        />
                        <Checkbox
                            title={'ś ź'}
                            checked={this.props.isvSearchLetters.from.includes('ś')}
                            onChange={() => {this.props.changeIsvSearchLetters('śź'); }}
                        />
                        <Checkbox
                            title={'ć'}
                            checked={this.props.isvSearchLetters.from.includes('ć')}
                            onChange={() => {this.props.changeIsvSearchLetters('ć'); }}
                        />
                        <Checkbox
                            title={'đ'}
                            checked={this.props.isvSearchLetters.from.includes('đ')}
                            onChange={() => {this.props.changeIsvSearchLetters('đ'); }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setInterfaceLang: (data: string) => dispatch(setInterfaceLang(data)),
        changeIsvSearchLetters: (data: string) => dispatch(changeIsvSearchLetters(data)),
    };
}

function mapStateToProps({interfaceLang, isvSearchLetters}) {
    return {interfaceLang, isvSearchLetters};
}

export default connect(mapStateToProps, mapDispatchToProps, null, {areStatePropsEqual: () => false})(Settings);
