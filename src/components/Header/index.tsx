import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { setPageAction, toggleMenuAction } from 'actions';

interface IHeaderProps {
    toggleMenu: (isVisible: boolean) => void;
    setPage: (page: string) => void;
    page: string;
    menuIsVisible: boolean;
}

const pages = [
    {
        name: 'Dictionary',
        value: 'dictionary',
    },
    {
        name: 'Grammar basics',
        value: 'grammar',
    },
    {
        name: 'About',
        value: 'about',
    },
];

class Header extends React.Component<IHeaderProps> {
    public render() {
        return (
            <nav className={'navbar navbar-dark bg-dark shadow header'}>
                <span className={'navbar-brand'}>
                    <img src={'logo.png'} height={'30'} className={'d-inline-block align-center logo'} alt={'logo'}/>
                    Medžuslovjansky slovnik
                </span>
                <button
                    type={'button'}
                    className={'showMenu'}
                    data-active={this.props.menuIsVisible}
                    onClick={() => this.props.toggleMenu(!this.props.menuIsVisible)}
                >
                    <span />
                </button>
                <div className={'navMenu' + (this.props.menuIsVisible ? ' menuIsVisible' : '')}>
                    <ul className={'navbar-nav mr-auto'}>
                        {pages.map(((link, i) => this.renderLink(this.props.page, link, i)))}
                    </ul>
                </div>
            </nav>
        );
    }

    private renderLink(page, {name, value}, i) {
        const isActive = page === value;
        return (
            <li className={'nav-item'} key={i}>
                <a className={'nav-link' + (isActive ? ' active' : '')} href={'#'} onClick={() => this.props.setPage(value)}>{name}</a>
            </li>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        toggleMenu: (isVisible) => dispatch(toggleMenuAction(isVisible)),
        setPage: (page) => dispatch(toggleMenuAction(false)) && dispatch(setPageAction(page)),
    };
}

function mapStateToProps({menuIsVisible, page}) {
    return {menuIsVisible, page};
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
