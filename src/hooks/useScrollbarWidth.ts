import { useEffect, useState } from 'react';

export function useScrollbarWidth(): number | undefined {
    const [sbw, setSbw] = useState(undefined);

    // this needed to ensure the scrollbar width in case hook called before the DOM is ready
    useEffect(() => {
        if (typeof sbw !== 'undefined') {
            return;
        }

        const raf = requestAnimationFrame(() => {
            const { body } = document;
            const scrollDiv = document.createElement('div');

            // Append element with defined styling
            scrollDiv.setAttribute(
                'style',
                'width: 1337px; height: 1337px; position: absolute; left: -9999px; overflow: scroll;',
            );
            body.appendChild(scrollDiv);

            // Collect width & height of scrollbar
            const calculateValue = (type) =>
                scrollDiv[`offset${type}`] - scrollDiv[`client${type}`];
            const scrollbarWidth = calculateValue('Width');

            setSbw(scrollbarWidth);

            // Remove element
            body.removeChild(scrollDiv);
        });

        return () => cancelAnimationFrame(raf);
    }, [sbw]);

    return sbw;
}
