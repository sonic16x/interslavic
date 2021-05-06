import { useCallback, useState } from 'react';
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
        const collapseMenu = useCallback(() => setMenuIsVisible(false), [setMenuIsVisible]);
        const enabledPages = useEnabledPages();

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
                    className={classNames('header__show-menu-button', menuIsVisible && 'expanded')}
                    aria-label={'Menu button'}
                    onClick={() => setMenuIsVisible(!menuIsVisible)}
                >
                    <span className={classNames('lines', {active: menuIsVisible})}/>
                </button>
                <nav className={classNames('header__menu', {active: menuIsVisible})}>
                  {pages
                      .filter(({ value }) => defaultPages.includes(value) || enabledPages.includes(value))
                      .map((({name, value}, i) => (
                    <MenuItem
                      key={value}
                      name={name}
                      value={value}
                      // hasBadge={value === 'about' && shouldShowAboutBadge}
                      hasBadge={false}
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
  hasBadge: boolean;
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
      className={classNames('header__menu-item', {active, hasBadge})}
      onClick={onClick}
    >
      {t(name)}
    </a>
  );
};
