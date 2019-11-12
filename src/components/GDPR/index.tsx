import * as React from 'react';
import './index.scss';

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
                <strong>This page uses cookies for analytics:&nbsp;</strong>
                <div className={'gdprActions'}>
                    <a rel={'noreferrer'} href={link} target={'_blank'}>Read more</a>
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
