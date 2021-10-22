import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import './index.scss';
import { setPageAction } from 'actions';
import { pages, defaultPages } from 'routing';
import { t } from 'translations';
import { useDispatch } from 'react-redux';
import { usePage } from 'hooks/usePage';
import { useInterfaceLang } from 'hooks/useInterfaceLang';
import { useEnabledPages } from 'hooks/useEnabledPages';
import LogoIcon from './images/logo-icon.svg';

export const Header =
    () => {
        const dispatch = useDispatch();
        const page = usePage();
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
        }, []);

        useEffect(() => {
            onResize();
        }, [navRef, logoRef, enabledPages]);

        return (
            <header
                className={classNames('header', {active: menuIsVisible, mobile, full})}
            >
                <h1
                    className={'logo'}
                    ref={logoRef}
                >
                    <span
                        className={'logo-img'}
                        onClick={() => {
                            dispatch(setPageAction('dictionary'));
                            setMenuIsVisible(false);
                        }}
                    >
                        <LogoIcon />
                    </span>
                    <span className={'logo-text'}>
                        {t('mainTitle')}
                    </span>
                </h1>
                <button
                    type={'button'}
                    className={classNames('show-menu-button', menuIsVisible && 'expanded')}
                    aria-label={'Menu button'}
                    onClick={() => setMenuIsVisible(!menuIsVisible)}
                >
                    <span className={classNames('lines', {active: menuIsVisible})}/>
                </button>
                <nav
                    className={classNames('menu', {active: menuIsVisible})}
                    ref={navRef}
                >
                  {pages
                      .filter(({ value }) => defaultPages.includes(value) || enabledPages.includes(value))
                      .map((({name, value}, i) => (
                    <MenuItem
                      key={value}
                      name={name}
                      value={value}
                      active={page === value}
                      onClick={collapseMenu}
                    />
                  )))}
                </nav>
            </header>
        );
    };

interface IMenuItemProps {
  name: string;
  value: string;
  hasBadge?: boolean;
  active: boolean;
  onClick: () => void;
}

const MenuItem: React.FC<IMenuItemProps> = ({
  name,
  value,
  active,
  onClick: customOnClick,
  hasBadge,
}) => {
  const dispatch = useDispatch();
  const onClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(setPageAction(value));
    customOnClick();
  }, [dispatch, setPageAction, customOnClick]);

  return (
    <a
      className={classNames('menu-item', {active, hasBadge})}
      onClick={onClick}
    >
      {t(name)}
    </a>
  );
};
