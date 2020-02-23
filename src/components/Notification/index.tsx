import * as React from 'react';
import './index.scss';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { setNotificationAction } from 'actions';
import { useEffect, useState } from 'react';

interface INotificationInternalProps {
    notification?: string;
    hide: () => void;
}

const NotificationInternal: React.FC<INotificationInternalProps> =
    ({notification, hide}: INotificationInternalProps) => {
        const [isVisible, setVisible] = useState(true);
        const [timer, setTimer] = useState(null);

        useEffect(() => {
            if (timer) {
                clearTimeout(timer);
            }
            const timerId = setTimeout(() => {
                hide();
                setVisible(true);
            }, 2000);
            setTimer(timerId);
        }, [!!notification]);

        return (
            <div className={'notification-container'}>
                <div
                    className={classNames('notification', {show: isVisible && !!notification})}
                    onClick={() => setVisible(false)}
                    onTransitionEnd={() => {
                        if (!isVisible) {
                            hide();
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

function mapStateToProps({notification}) {
    return {notification};
}

function mapDispatchProps(dispatch) {
    return {
        hide: () => dispatch(setNotificationAction('')),
    };
}

export const Notification = connect(mapStateToProps, mapDispatchProps)(NotificationInternal);
