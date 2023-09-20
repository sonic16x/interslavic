import classNames from 'classnames';

import { ITranslateNode } from 'services/translator';

import './TranslateItem.scss';

interface ITranslateItemProps {
    node: ITranslateNode;
    index: number;
    onItemChange?: (itemIndex: number, formIndex: number) => void;
    onHover?: (node: ITranslateNode, index: number, isHover: boolean) => void;
    isLoading?: boolean;
}

export const TranslateItem = ({ node, onItemChange, onHover, index, isLoading }: ITranslateItemProps) => {
    const { str, type, forms } = node;
    const hasForms = forms && forms.length > 1;

    return (
        <div
            className={classNames('translate-item', [type], { forms: hasForms, br: str === '\n', loading: isLoading })}
            key={index}
            onMouseOver={() => onHover(node, index, true)}
            onMouseOut={() => onHover(node, index, false)}
        >
            {str}
            {
                hasForms && (
                    <select
                        className="translate-item__form-select"
                        onChange={(e) => onItemChange(index, e.currentTarget.selectedIndex)}
                    >
                        {forms.map((form, i) => <option key={i} value={i}>{form}</option>)}
                    </select>
                )
            }
        </div>
    );
}
