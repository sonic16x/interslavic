import classNames from 'classnames';

import { Button } from 'components/Button';

import './Confirm.scss';

interface IConfirmProps {
    className?: string;
    text: string;
    okText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const Confirm = (
    {
        className,
        text,
        okText,
        cancelText,
        onConfirm,
        onCancel,
    }: IConfirmProps,
) => {
    return (
        <div
            className={classNames(['confirm', className])}
        >
            <div
                className="confirm__text"
            >
                {text}
            </div>
            <div
                className="confirm__buttons"
            >
                <Button
                    onClick={onCancel}
                    size="M"
                    title={cancelText}
                />
                <Button
                    onClick={onConfirm}
                    type="error"
                    size="M"
                    title={okText}
                />
            </div>
        </div>
    )
};
