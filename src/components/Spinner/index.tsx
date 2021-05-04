
import './index.scss';

interface ISpinnerProps {
    size: string;
    borderWidth: string;
}

export const Spinner: React.FC<ISpinnerProps> =
    ({ size, borderWidth}) => (
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
