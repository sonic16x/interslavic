import * as React from 'react';
import './index.scss';
import { t } from 'translations';

interface IGDPRState {
    show: boolean;
}

export default class extends React.Component<{}, IGDPRState> {
    constructor(props) {
        super(props);
        const showAlert = localStorage.getItem('gdprAlert') !== 'false';
        this.state = {
            show: showAlert,
        };
    }
    public render() {
        const link = 'https://yandex.com/legal/metrica_agreement/';
        return (
            <div
                className={'alert alert-warning gdprAlert' + (!this.state.show ? ' hide' : '')}
                role={'alert'}
            >
                <strong>{t('gdprAlert')}&nbsp;</strong>
                <div className={'gdprActions'}>
                    <a rel={'noreferrer'} href={link} target={'_blank'}>{t('gdprAlertReadMore')}</a>
                    <button
                        type={'button'}
                        className={'btn btn-primary'}
                        aria-label={'Hide alert'}
                        onClick={() => this.hideAlert()}
                    >
                        Ok
                    </button>
                </div>
            </div>
        );
    }
    private hideAlert() {
        this.setState({show: false});
        localStorage.setItem('gdprAlert', 'false');
    }
}
