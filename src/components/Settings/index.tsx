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
        name: 'Русский',
        value: 'ru',
    },
    {
        name: 'Medžuslovjansky',
        value: 'isv_latin',
    },
    {
        name: 'Меджусловјанскы',
        value: 'isv_cyrillic',
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
                <h2>{t('settingsTitle')}</h2>
                <hr/>
                <Selector
                    options={interfaceLanguageList}
                    value={this.props.interfaceLang}
                    label={t('interfaceLanguage')}
                    onSelect={(langCode: string) => this.props.setInterfaceLang(langCode)}
                />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setInterfaceLang: (data: string) => setInterfaceLang(data)(dispatch),
    };
}

function mapStateToProps({interfaceLang}) {
    return {interfaceLang};
}

export default connect(mapStateToProps, mapDispatchToProps, null, {areStatePropsEqual: () => false})(Settings);
