import cn from 'classnames'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import './Hint.scss'

interface IHintProps {
    title: string
    shortTitle: string
    className?: string
    hideTimeout?: number
}

export const Hint = ({
    title,
    shortTitle,
    className,
    hideTimeout = 1500,
}: IHintProps) => {
    const anchorRef = useRef<HTMLSpanElement>(null)
    const hintRef = useRef<HTMLSpanElement>(null)
    const [visible, setVisible] = useState<boolean>(false)
    const [show, setShow] = useState<boolean>(false)
    const anchorRect = anchorRef?.current?.getBoundingClientRect()
    const hintRect = hintRef?.current?.getBoundingClientRect()
    const hasHover = useMemo(() => window.matchMedia('(hover: hover)').matches, [])

    const hideElement = () => {
        setVisible(false)
    }

    useEffect(() => {
        if (!hasHover) {
            document.addEventListener('scroll', hideElement, true)
            document.addEventListener('click', hideElement, true)
        }

        return () => {
            if (!hasHover) {
                document.removeEventListener('scroll', hideElement, true)
                document.removeEventListener('click', hideElement, true)
            }
        }
    }, [])

    useEffect(() => {
        if (show) {
            setVisible(true)
        }
    }, [show])

    return (
        <span
            ref={anchorRef}
            className={cn('hint', className)}
            onClick={() => {
                if (!hasHover) {
                    setShow(true)
                    setTimeout(hideElement, hideTimeout)

                    document.addEventListener('click', hideElement, true)

                }
            }}
            onMouseEnter={() => {
                if (hasHover) {
                    setShow(true)
                }
            }}
            onMouseLeave={() => {
                if (hasHover) {
                    hideElement()
                }
            }}
        >
            {shortTitle}
            {show && createPortal(
                (
                    <span
                        ref={hintRef}
                        className={cn('hint-global', { visible })}
                        style={{
                            top: anchorRect?.top,
                            left: (
                                (anchorRect?.left + hintRect?.width > window.screen.width) ?
                                    (window.screen.width - hintRect?.width - 16) : anchorRect?.left
                            ),
                        }}
                        onTransitionEnd={() => {
                            if (!visible) {
                                setShow(false)
                            }
                        }}
                    >
                        {title}
                    </span>
                ),
                document.getElementById('app')
            )}
        </span>
    )
}
