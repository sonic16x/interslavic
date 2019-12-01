import * as React from 'react';
import { connect } from 'connect';
import './index.scss';
import { setPageAction } from 'actions';
import { pages } from 'routing';
import { t } from 'translations';

interface IHeaderProps {
    setPage: (page: string) => void;
    page: string;
}

interface IHeaderState {
    menuIsVisible: boolean;
}

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
                    <img
                        src={`${BASE_URL}/logo.png`.replace(/\/\//, '/')}
                        height={'30'}
                        className={'d-inline-block align-center logo'}
                        alt={'logo'}
                        onClick={() => this.setPage('dictionary')}
                    />
                    {t('mainTitle')}
                </span>
                <button
                    type={'button'}
                    className={'showMenu'}
                    aria-label={'Menu button'}
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
                <button
                    aria-label={'Menu item'}
                    className={'btn btn-link nav-link' + (isActive ? ' active' : '')}
                    onClick={() => this.setPage(value)}
                >
                    {t(name)}
                </button>
            </li>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setPage: (page) => dispatch(setPageAction(page)),
    };
}

function mapStateToProps({page}) {
    return {page};
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
