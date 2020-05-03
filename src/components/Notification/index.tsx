import * as React from 'react';
import './index.scss';
import classNames from 'classnames';
import { setNotificationAction } from 'actions';
import { useEffect, useState } from 'react';
import { useNotification } from 'hooks/useNotification';
import { useDispatch } from 'react-redux';

export const Notification: React.FC =
    () => {
        const dispatch = useDispatch();
        const notification = useNotification();
        const [isVisible, setVisible] = useState(true);
        const [timer, setTimer] = useState(null);

        useEffect(() => {
            if (timer) {
                clearTimeout(timer);
            }
            const timerId = setTimeout(() => {
                dispatch(setNotificationAction(''));
                setVisible(true);
            }, 2000);
            setTimer(timerId);
        }, [!!notification, dispatch]);

        return (
            <div className={'notification-container'}>
                <div
                    className={classNames('notification', {show: isVisible && !!notification})}
                    onClick={() => setVisible(false)}
                    onTransitionEnd={() => {
                        if (!isVisible) {
                            dispatch(setNotificationAction(''));
                            setVisible(true);
                            if (timer) {
                                clearTimeout(timer);
                            }
                        }
                    }}
                >
                    {notification}
                </div>
            </div>
        );
    };
