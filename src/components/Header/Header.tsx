import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { t } from 'translations';

import { setPageAction } from 'actions';

import { useBadges } from 'hooks/useBadges';
import { useEnabledPages } from 'hooks/useEnabledPages';
import { useInterfaceLang } from 'hooks/useInterfaceLang';
import { usePage } from 'hooks/usePage';
import { defaultPages, pages } from 'routing';

import './Header.scss';

import LogoIcon from './images/logo-icon.svg';

export const Header =
    () => {
        const dispatch = useDispatch();
        const page = usePage();
        const badges = useBadges();
        useInterfaceLang();
        const [menuIsVisible, setMenuIsVisible] = useState(false);
        const [mobile, setMobile] = useState(false);
        const [full, setFull] = useState(false);
        const collapseMenu = useCallback(() => setMenuIsVisible(false), [setMenuIsVisible]);
        const enabledPages = useEnabledPages();
        const navRef = useRef<HTMLDivElement>();
        const logoRef = useRef<HTMLDivElement>();

        const onResize = useCallback(() => {
            if (navRef && navRef.current && logoRef && logoRef.current) {
                const windowWidth = document.body.clientWidth;
                const logoWidth = logoRef.current.getBoundingClientRect().width;
                const navWidth = navRef.current.getBoundingClientRect().width;
                const full = windowWidth > 1050;
                const mobile = !full && logoWidth + navWidth + 20 > windowWidth;

                setMobile(mobile);
                setFull(full);
            }
        }, [navRef, logoRef]);

        useEffect(() => {
            window.addEventListener('resize', onResize);

            return () => {
                window.removeEventListener('resize', onResize);
            };
        }, [onResize]);

        useEffect(() => {
            onResize();
        }, [navRef, logoRef, enabledPages, onResize]);

        return (
            <header
                className={classNames('header', 'color-theme--light', { active: menuIsVisible, mobile, full })}
            >
                <h1
                    className="logo"
                    ref={logoRef}
                >
                    <span
                        className="logo-img"
                        onClick={() => {
                            dispatch(setPageAction('dictionary'));
                            setMenuIsVisible(false);
                        }}
                    >
                        <LogoIcon/>
                    </span>
                    <span className="logo-text" data-testid="main-title">
                        {t('mainTitle')}
                    </span>
                </h1>
                <button
                    type="button"
                    className={classNames('show-menu-button', { 'expanded': menuIsVisible, 'badge': badges.length })}
                    aria-label="Menu button"
                    onClick={() => setMenuIsVisible(!menuIsVisible)}
                >
                    <span className={classNames('lines', { active: menuIsVisible })}/>
                </button>
                <nav
                    className={classNames('menu', { active: menuIsVisible })}
                    ref={navRef}
                >
                    {pages
                        .filter(({ value }) => {
                            if (value === 'community' && !IS_COM) {
                                return false
                            }
                            
                            return (defaultPages.includes(value) || enabledPages.includes(value))
                        })
                        .map((({ title, value, subTitle }) => (
                            <MenuItem
                                key={value}
                                title={title}
                                subTitle={subTitle}
                                value={value}
                                active={page === value}
                                hasBadge={badges.includes(value)}
                                onClick={collapseMenu}
                            />
                        )))}
                </nav>
            </header>
        );
    };

interface IMenuItemProps {
    title: string;
    subTitle?: string;
    value: string;
    hasBadge?: boolean;
    active: boolean;
    onClick: () => void;
}

const MenuItem = ({
    title,
    subTitle,
    value,
    active,
    onClick: customOnClick,
    hasBadge,
}: IMenuItemProps) => {
    const dispatch = useDispatch();
    const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        dispatch(setPageAction(value));
        customOnClick();
    };

    return (
        <a
            className={classNames('menu-item', { active, 'badge': hasBadge })}
            onClick={onClick}
            data-sub-title={subTitle}
        >
            {t(title)}
        </a>
    );
};
