import * as React from 'react';
import { useCallback, useState } from 'react';
import classNames from 'classnames';
import './index.scss';
import { setPageAction } from 'actions';
import { pages } from 'routing';
import { t } from 'translations';
import { useDispatch } from 'react-redux';
import { usePage } from 'hooks/usePage';
import { useInterfaceLang } from 'hooks/useInterfaceLang';
import LogoIcon from './images/logo-icon.svg';
import ClownIcon from './images/clown.svg';
import { useSurveyBanner } from 'hooks/useSurveyBanner';
import { isApril1 } from '../../utils/isApril1';
import { getMobileOperatingSystem } from '../../utils/getMobileOperatingSystem';

export const Header: React.FC =
    () => {
        const dispatch = useDispatch();
        const page = usePage();
        useInterfaceLang();
        const [menuIsVisible, setMenuIsVisible] = React.useState(false);
        const collapseMenu = useCallback(() => setMenuIsVisible(false), [setMenuIsVisible]);
        const { shouldShowAboutBadge } = useSurveyBanner();
        const [april1, setApril1] = React.useState(false);
        const [isAndroid, setAndroid] = React.useState(false);

        React.useEffect(() => {
          setApril1(isApril1());
          setAndroid(getMobileOperatingSystem() === 'Android');
        });

        return (
            <header className={classNames('header', { 'active': menuIsVisible, 'april-1': april1, 'is-android': isAndroid })}>
                <h1 className={'header__logo'}>
                    <span
                        className={'header__logo-img'}
                        onClick={() => {
                            dispatch(setPageAction('dictionary'));
                            setMenuIsVisible(false);
                        }}
                    >
                        {april1 ? <ClownIcon /> : <LogoIcon />}
                    </span>
                    <span className={'header__logo-text'}>
                        {april1 ? 'Medžuslovjanskы slovnik' : t('mainTitle')}
                    </span>
                </h1>
                <button
                    type={'button'}
                    className={classNames('header__show-menu-button', menuIsVisible && 'expanded', shouldShowAboutBadge && 'hasBadge')}
                    aria-label={'Menu button'}
                    onClick={() => setMenuIsVisible(!menuIsVisible)}
                >
                    <span className={classNames('lines', {active: menuIsVisible})}/>
                </button>
                <nav className={classNames('header__menu', {active: menuIsVisible})}>
                  {pages.map((({name, value}, i) => (
                    <MenuItem
                      key={value}
                      name={name}
                      value={value}
                      hasBadge={value === 'about' && shouldShowAboutBadge}
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
