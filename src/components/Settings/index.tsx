import { changeIsvSearchLetters, setInterfaceLang, setAlphabets } from 'actions';
import { Selector } from 'components/Selector';
import * as React from 'react';
import { connect } from 'react-redux';
import { IMainState } from 'reducers';
import { t } from 'translations';
import { Checkbox } from '../Checkbox';
import './index.scss';

interface ISettingsPropsInternal {
    interfaceLang: string;
    setInterfaceLang: (data: string) => void;
    isvSearchLetters: { from: string[], to: string[] };
    changeIsvSearchLetters: (letters: string) => void;
    alphabets: any;
    setAlphabets: (data: any) => void;
}

const interfaceLanguageList = [
    {
        name: 'English',
        value: 'en',
    },
    {
        name: 'Medžuslovjansky',
        value: 'isv-latn',
    },
    {
        name: 'Меджусловјанскы',
        value: 'isv-cyrl',
    },
    {
        name: 'MⰅⰌⰖⰔⰎⰑⰂⰬⰀⰐⰔⰍⰠ',
        value: 'isv-glag',
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

const SettingsInternal: React.FC<ISettingsPropsInternal> =
    (props: ISettingsPropsInternal) => (
        <div className={'settings'}>
            <div className={'settingsContent'}>
                <h4>{t('settingsTitle')}</h4>
                <hr/>
                <h5>{t('interfaceLanguage')}</h5>
                <Selector
                    options={interfaceLanguageList}
                    value={props.interfaceLang}
                    onSelect={(langCode: string) => props.setInterfaceLang(langCode)}
                />
                <hr/>
                <h5>{t('searchSensitiveLettersForInterslavic')}</h5>
                <div className={'isvSearchLetters'}>
                    <h6>{t('standardOrthography')}</h6>
                    <Checkbox
                        title={'ž š č (ж ш ч)'}
                        checked={props.isvSearchLetters.from.includes('ž')}
                        onChange={() => {props.changeIsvSearchLetters('žšč'); }}
                    />
                    <Checkbox
                        title={'ě (ѣ)'}
                        checked={props.isvSearchLetters.from.includes('ě')}
                        onChange={() => {props.changeIsvSearchLetters('ě'); }}
                    />
                    <Checkbox
                        title={'y (ы)'}
                        checked={props.isvSearchLetters.from.includes('y')}
                        onChange={() => {props.changeIsvSearchLetters('y'); }}
                    />
                    <h6>{t('etymologicalOrthography')}</h6>
                    <Checkbox
                        title={'å'}
                        checked={props.isvSearchLetters.from.includes('å')}
                        onChange={() => {props.changeIsvSearchLetters('å'); }}
                    />
                    <Checkbox
                        title={'ę ų'}
                        checked={props.isvSearchLetters.from.includes('ę')}
                        onChange={() => {props.changeIsvSearchLetters('ęų'); }}
                    />
                    <Checkbox
                        title={'ò'}
                        checked={props.isvSearchLetters.from.includes('ò')}
                        onChange={() => {props.changeIsvSearchLetters('ò'); }}
                    />
                    <Checkbox
                        title={'ŕ'}
                        checked={props.isvSearchLetters.from.includes('ŕ')}
                        onChange={() => {props.changeIsvSearchLetters('ŕ'); }}
                    />
                    <Checkbox
                        title={'ľ ń'}
                        checked={props.isvSearchLetters.from.includes('ľ')}
                        onChange={() => {props.changeIsvSearchLetters('ľń'); }}
                    />
                    <Checkbox
                        title={'ť ď'}
                        checked={props.isvSearchLetters.from.includes('ť')}
                        onChange={() => {props.changeIsvSearchLetters('ťď'); }}
                    />
                    <Checkbox
                        title={'ś ź'}
                        checked={props.isvSearchLetters.from.includes('ś')}
                        onChange={() => {props.changeIsvSearchLetters('śź'); }}
                    />
                    <Checkbox
                        title={'ć'}
                        checked={props.isvSearchLetters.from.includes('ć')}
                        onChange={() => {props.changeIsvSearchLetters('ć'); }}
                    />
                    <Checkbox
                        title={'đ'}
                        checked={props.isvSearchLetters.from.includes('đ')}
                        onChange={() => {props.changeIsvSearchLetters('đ'); }}
                    />
                </div>
                <hr/>
                <h5>{t('alphabets')}</h5>
                <Checkbox
                    title={t('latin')}
                    checked={props.alphabets.latin}
                    onChange={() => props.setAlphabets({latin: !props.alphabets.latin})}
                />
                <Checkbox
                    title={t('cyrillic')}
                    checked={props.alphabets.cyrillic}
                    onChange={() => props.setAlphabets({cyrillic: !props.alphabets.cyrillic})}
                />
                <Checkbox
                    title={t('glagolitic')}
                    checked={props.alphabets.glagolitic}
                    onChange={() => props.setAlphabets({glagolitic: !props.alphabets.glagolitic})}
                />
            </div>
        </div>
    );

function mapDispatchToProps(dispatch) {
    return {
        setAlphabets: (data) => dispatch(setAlphabets(data)),
        setInterfaceLang: (data: string) => dispatch(setInterfaceLang(data)),
        changeIsvSearchLetters: (data: string) => dispatch(changeIsvSearchLetters(data)),
    };
}

function mapStateToProps({interfaceLang, isvSearchLetters, alphabets}: IMainState) {
    return {
        interfaceLang,
        isvSearchLetters,
        alphabets,
    };
}

export const Settings = connect(mapStateToProps, mapDispatchToProps, null, {areStatePropsEqual: () => false})(SettingsInternal);
