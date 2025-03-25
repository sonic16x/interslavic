import { useEffect, useMemo, useState } from 'react'

import { useScrollbarWidth } from 'hooks'
import { isScrollBarVisible } from 'utils'

export const useResultsStyles = ({ containerRef, resultsCount, short }) => {
    const [scrollIsVisible, setScrollBarVisible] = useState(false)
    const scrollBarWidth = useScrollbarWidth()

    const gapSize = useMemo(() => (
        parseInt(window.getComputedStyle(document.body).getPropertyValue('--gap-size').slice(0, -2))
    ), [])

    const gapSizeS = useMemo(() => (
        parseInt(window.getComputedStyle(document.body).getPropertyValue('--gap-size-s').slice(0, -2))
    ), [])

    const isMobile = useMemo(() => document.body.offsetWidth < 1024, [])

    useEffect(() => setScrollBarVisible(isScrollBarVisible(containerRef)), [containerRef, resultsCount])

    return useMemo(() => {
        const gap = short ? gapSizeS : gapSize

        if (scrollIsVisible) {
            return {
                paddingLeft: gap,
                paddingRight: gap - scrollBarWidth,
            }
        }

        if (isMobile) {
            return {
                paddingLeft: gap,
                paddingRight: gap,
            }
        }

        return {
            paddingLeft: 0,
            paddingRight: 0,
        }
    }, [short, gapSize, gapSizeS, scrollIsVisible, scrollBarWidth])
}
