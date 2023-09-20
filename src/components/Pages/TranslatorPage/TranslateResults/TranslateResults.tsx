import classNames from 'classnames';
import { useCallback } from 'react';

import { ITranslateNode, Translator } from 'services/translator';

import { TranslateItem } from 'components/Pages/TranslatorPage/TranslateItem';
import { Spinner } from 'components/Spinner';

import './TranslateResults.scss';

interface ITranslateResultsProps {
    results: ITranslateNode[];
    className?: string;
    onChange: (changedNodes: ITranslateNode[]) => void;
    onHover: (node: ITranslateNode, index: number, isHover: boolean) => void;
    isLoading?: boolean;
}

export const TranslateResults = ({ className, results, onChange, isLoading, onHover }: ITranslateResultsProps) => {
    const onItemChange = useCallback((itemIndex, formIndex) => {
        onChange(Translator.replaceNode(results, itemIndex, formIndex));
    }, [results]);

    return (
        <div
            className={classNames('translate-results', [className])}
        >
            {results.map((node, i) => (
                <TranslateItem
                    key={i}
                    node={node}
                    index={i}
                    onItemChange={onItemChange}
                    onHover={onHover}
                    isLoading={isLoading}
                />
            ))}
            {isLoading && (
                <div className="translate-results__loader">
                    <Spinner
                        size="10px"
                        borderWidth="3px"
                    />
                </div>
            )}
        </div>
    );
}
