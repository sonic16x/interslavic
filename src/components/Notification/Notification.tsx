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
            if (!hasNotification || !isVisible) {
                return;
            }

            if (timer) {
                clearTimeout(timer);
            }

            const timerId = setTimeout(() => {
                dispatch(setNotificationAction(''));
            }, 2000);

            setTimer(timerId);
        }, [hasNotification, dispatch]);

        return (
            <div className="notification-container">
                <div
                    className={classNames('notification', [notification?.type], { show: isVisible && !!notification })}
                    onClick={() => setVisible(false)}
                    onTransitionEnd={() => {
                        if (!isVisible) {
                            dispatch(setNotificationAction(null));
                            setVisible(true);
                            if (timer) {
                                clearTimeout(timer);
                            }
                        }
                    }}
                >
                    {notification?.text}
                </div>
            </div>
        );
    };
