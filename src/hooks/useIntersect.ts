import { Ref, useEffect, useRef, useState } from 'react';

declare const IntersectionObserver: any;

interface IIntersectHookParams {
    root?: HTMLElement;
    rootMargin?: string;
    threshold?: number;
    onShown?: (entry: any) => void;
}

type IntersectHookResult = [Ref<any>, any];

export function useIntersect({ root = null, rootMargin, threshold = 0, onShown }: IIntersectHookParams): IntersectHookResult {
    const [entry, updateEntry] = useState({});
    const [node, setNode] = useState(null);

    const observer = useRef(
        new IntersectionObserver(([entry]) => {
            updateEntry(entry);
            if (entry.intersectionRatio >= threshold) {
                onShown(entry);
            }
        }, {
            root,
            rootMargin,
            threshold,
        }),
    );

    useEffect(
        () => {
            const { current: currentObserver } = observer;
            currentObserver.disconnect();

            if (node) { currentObserver.observe(node); }

            return () => currentObserver.disconnect();
        },
        [node, root, rootMargin, threshold, onShown],
    );

    return [setNode, entry];
}
