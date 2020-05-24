import * as React from 'react';
import classNames from 'classnames';
import './index.scss';
import { setPageAction } from 'actions';
import { pages } from 'routing';
import { t } from 'translations';
import { useDispatch } from 'react-redux';
import { usePage } from 'hooks/usePage';
import { useInterfaceLang } from 'hooks/useInterfaceLang';
import LogoIcon from './images/logo-icon.svg';

export const Header: React.FC =
    () => {
        const dispatch = useDispatch();
        const page = usePage();
        useInterfaceLang();
        const [menuIsVisible, setMenuIsVisible] = React.useState(false);

        return (
            <header className={classNames('header', {active: menuIsVisible})}>
                <h1 className={'header__logo'}>
                    <span
                        className={'header__logo-img'}
                        onClick={() => {
                            dispatch(setPageAction('dictionary'));
                            setMenuIsVisible(false);
                        }}
                    >
                        <LogoIcon />
                    </span>
                    <span className={'header__logo-text'}>
                        {t('mainTitle')}
                    </span>
                </h1>
                <button
                    type={'button'}
                    className={'header__show-menu-button'}
                    aria-label={'Menu button'}
                    onClick={() => setMenuIsVisible(!menuIsVisible)}
                >
                    <span className={classNames('lines', {active: menuIsVisible})}/>
                </button>
                <nav className={classNames('header__menu', {active: menuIsVisible})}>
                    {pages.map((({name, value}, i) => (
                        <a
                            key={i}
                            className={classNames('header__menu-item', {active: page === value})}
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch(setPageAction(value));
                                setMenuIsVisible(false);
                            }}
                        >
                            {t(name)}
                        </a>
                    )))}
                </nav>
            </header>
        );
    };
