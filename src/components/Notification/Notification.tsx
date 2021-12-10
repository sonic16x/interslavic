import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { setNotificationAction } from 'actions';

import { useNotification } from 'hooks/useNotification';

import './Notification.scss';

export const Notification =
    () => {
        const dispatch = useDispatch();
        const notification = useNotification();
        const [isVisible, setVisible] = useState(true);
        const [timer, setTimer] = useState(null);
        const hasNotification = !!notification;

        useEffect(() => {
            if (timer) {
                clearTimeout(timer);
            } else {
                return;
            }

            const timerId = setTimeout(() => {
                dispatch(setNotificationAction(''));
                setVisible(true);
            }, 2000);

            setTimer(timerId);
        }, [hasNotification, dispatch, timer, setTimer]);

        return (
            <div className="notification-container">
                <div
                    className={classNames('notification', { show: isVisible && !!notification })}
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
