import * as React from 'react';
import './index.scss';

interface IHeaderProps {
    showInfo: () => void;
}

interface IHeaderState {
}

export class Header extends React.Component<IHeaderProps, IHeaderState> {
    public render() {
        return (
            <nav className={'navbar navbar-dark bg-dark shadow'}>
                <span className={'navbar-brand'}>
                    <img src={'logo.png'} height={'30'} className={'d-inline-block align-center logo'} alt={'logo'}/>
                    Medžuslovjansky slovnik
                </span>
                <button type={'button'} className={'btn btn-primary rounded-circle info'} onClick={() => this.props.showInfo()}>i</button>
            </nav>
        );
    }
}