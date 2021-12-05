
import './Spinner.scss';

interface ISpinnerProps {
    size: string;
    borderWidth: string;
}

export const Spinner =
    ({ size, borderWidth }: ISpinnerProps) => (
        <div
            className={'spinner'}
            style={{
                width: size,
                height: size,
                borderWidth,
            }}
        >
            <span />
        </div>
    );
