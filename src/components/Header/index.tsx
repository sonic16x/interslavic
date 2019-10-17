import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { setPageAction } from 'actions';

interface IHeaderProps {
    setPage: (page: string) => void;
    page: string;
}

interface IHeaderState {
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

class Header extends React.Component<IHeaderProps, IHeaderState> {
    constructor(props) {
        super(props);
        this.state = {
            menuIsVisible: false,
        };
    }
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
                    data-active={this.state.menuIsVisible}
                    onClick={() => this.setState({menuIsVisible: !this.state.menuIsVisible})}
                >
                    <span />
                </button>
                <div className={'navMenu' + (this.state.menuIsVisible ? ' menuIsVisible' : '')}>
                    <ul className={'navbar-nav mr-auto'}>
                        {pages.map(((link, i) => this.renderLink(this.props.page, link, i)))}
                    </ul>
                </div>
            </nav>
        );
    }
    private setPage(page) {
        this.props.setPage(page);
        this.setState({menuIsVisible: false});
    }
    private renderLink(page, {name, value}, i) {
        const isActive = page === value;
        return (
            <li className={'nav-item'} key={i}>
                <a
                    className={'nav-link' + (isActive ? ' active' : '')}
                    href={'#'}
                    onClick={() => this.setPage(value)}
                >
                    {name}
                </a>
            </li>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setPage: (page) => dispatch(setPageAction(page)),
    };
}

function mapStateToProps({menuIsVisible, page}) {
    return {page};
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
