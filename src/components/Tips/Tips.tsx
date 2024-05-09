import classNames from 'classnames';
import { useDispatch } from 'react-redux';

import { setNotificationAction } from 'actions';

import './Clipboard.scss';

interface ITipsProps {
    str: string;
    tips: string;
    className?: string;
}

export const Tips =
    ({ str, tips, className }: ITipsProps) => {
        const dispatch = useDispatch();
        const onClick = () => {
            dispatch(setNotificationAction({ text: tips }));
        };

        return (
            <span
                onClick={onClick}
                className={classNames('tips', className)}
            >
                {str}
            </span>
        );
    };
