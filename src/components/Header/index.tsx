import { setPageAction } from 'actions';
import { connect } from 'connect';
import * as React from 'react';
import { pages } from 'routing';
import { t } from 'translations';
import './index.scss';

interface IHeaderProps {
    setPage: (page: string) => void;
    page: string;
}

interface IHeaderLink {
    name: string;
    active: boolean;
    onClick: () => void;
}

const HeaderLink: React.FC<IHeaderLink> =
    ({name, onClick, active}: IHeaderLink) => (
        <li className={'nav-item'}>
            <button
                aria-label={'Menu item'}
                className={'btn btn-link nav-link' + (active ? ' active' : '')}
                onClick={onClick}
            >
                {t(name)}
            </button>
        </li>
    );

const HeaderInternal: React.FC<IHeaderProps> =
    ({page, setPage}: IHeaderProps) => {
        const [menuIsVisible, setMenuIsVisible] = React.useState(false);

        return (
            <nav className={'navbar navbar-dark bg-dark shadow header'}>
                <span className={'navbar-brand'}>
                    <img
                        src={`${BASE_URL}/logo.png`.replace(/\/\//, '/')}
                        height={'30'}
                        className={'d-inline-block align-center logo'}
                        alt={'logo'}
                        onClick={() => {
                            setPage('dictionary');
                            setMenuIsVisible(false);
                        }}
                    />
                    {t('mainTitle')}
                </span>
                <button
                    type={'button'}
                    className={'showMenu'}
                    aria-label={'Menu button'}
                    data-active={menuIsVisible}
                    onClick={() => setMenuIsVisible(!menuIsVisible)}
                >
                    <span />
                </button>
                <div className={'navMenu' + (menuIsVisible ? ' menuIsVisible' : '')}>
                    <ul className={'navbar-nav mr-auto'}>
                        {pages.map((({name, value}, i) => (
                            <HeaderLink
                                name={name}
                                key={i}
                                active={page === value}
                                onClick={() => {
                                    setPage(value);
                                    setMenuIsVisible(false);
                                }}
                            />
                        )))}
                    </ul>
                </div>
            </nav>
        );
    };

function mapDispatchToProps(dispatch) {
    return {
        setPage: (page) => dispatch(setPageAction(page)),
    };
}

function mapStateToProps({page}) {
    return {page};
}

export const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderInternal);
