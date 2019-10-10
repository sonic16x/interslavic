import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { showInfoAction } from 'actions';

interface IHeaderProps {
    showInfo: () => void;
}

class Header extends React.Component<IHeaderProps> {
    public render() {
        return (
            <nav className={'navbar navbar-dark bg-dark shadow'}>
                <span className={'navbar-brand'}>
                    <img src={'logo.png'} height={'30'} className={'d-inline-block align-center logo'} alt={'logo'}/>
                    Medžuslovjansky slovnik
                </span>
                <button
                    type={'button'}
                    className={'btn btn-primary rounded-circle info'}
                    onClick={() => this.props.showInfo()}
                >
                    i
                </button>
            </nav>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        showInfo: () => dispatch(showInfoAction(true)),
    };
}

export default connect(null, mapDispatchToProps)(Header);
