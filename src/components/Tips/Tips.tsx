import classNames from 'classnames'

import './Tips.scss'

interface ITipsProps {
    str: string;
    tips: string;
    className?: string;
}

export const Tips =
    ({ str, tips, className }: ITipsProps) => {
        return (
            <>
                <span
                    className={classNames('tips', className)}
                    data-tips={tips}
                >
                    {str}&nbsp;<span className="tipsSymbol" />
                </span>
            </>
        )
    }
