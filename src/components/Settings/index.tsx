import * as React from 'react';
import './index.scss';
import { connect } from 'react-redux';
import { setInterfaceLang } from 'actions';
import { Selector } from 'components/Selector';
import { t } from 'translations';

interface ISettingsProps {
    interfaceLang: string;
    setInterfaceLang: (data: string) => void;
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
        name: 'Polski',
        value: 'pl',
    },
    {
        name: 'Češky',
        value: 'cs',
    },
    {
        name: 'Slovenský',
        value: 'sk',
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
                    <Selector
                        options={interfaceLanguageList}
                        value={this.props.interfaceLang}
                        label={t('interfaceLanguage')}
                        onSelect={(langCode: string) => this.props.setInterfaceLang(langCode)}
                    />
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setInterfaceLang: (data: string) => dispatch(setInterfaceLang(data)),
    };
}

function mapStateToProps({interfaceLang}) {
    return {interfaceLang};
}

export default connect(mapStateToProps, mapDispatchToProps, null, {areStatePropsEqual: () => false})(Settings);
