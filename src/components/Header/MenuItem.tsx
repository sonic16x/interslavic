import * as React from 'react';
import classNames from 'classnames';
import { setPageAction } from '../../actions';
import { t } from '../../translations';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

export interface IMenuItemProps {
  name: string;
  value: string;
  hasBadge: boolean;
  active: boolean;
  onClick: () => void;
}

export const MenuItem: React.FC<IMenuItemProps> = ({name, value, active, onClick: customOnClick, hasBadge}) => {
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
