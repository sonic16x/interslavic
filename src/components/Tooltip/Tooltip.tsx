import {
    cloneElement,
    PointerEvent as ReactPointerEvent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useCallback,
    useEffect,
    useId,
    useLayoutEffect,
    useRef,
    useState,
} from 'react'
import { createPortal } from 'react-dom'

import './Tooltip.scss'

interface ITooltipProps {
    content: ReactNode
    /** one DOM element: it gets the handlers and aria-describedby, no wrapper around it */
    children: ReactElement<any>
}

const MARGIN = 8
const GAP = 6
const DELAY = 300
const FOCUSABLE = ['a', 'button', 'input', 'select', 'textarea']

/** one tooltip at a time: opening one closes the other */
let closeOpen: (() => void) | null = null

/**
 * A tooltip in #app (the theme lives there), outside every overflow container of the trigger: position: fixed from
 * the trigger's rect, above it or below when there is no room, kept inside the viewport.
 * Mouse: hover with a delay. Keyboard: focus. Touch: a tap toggles it on a trigger that does nothing else.
 */
export const Tooltip = ({ content, children }: ITooltipProps) => {
    const id = useId()
    const trigger = useRef<HTMLElement>(null)
    const tip = useRef<HTMLSpanElement>(null)
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
    const via = useRef<'hover' | 'focus' | 'touch'>(undefined)
    const touch = useRef(false)
    const [open, setOpen] = useState(false)

    const hide = useCallback(() => {
        clearTimeout(timer.current)
        setOpen(false)
    }, [])
    const show = useCallback((how: typeof via.current) => {
        clearTimeout(timer.current)
        via.current = how
        if (closeOpen !== hide) {
            closeOpen?.()
        }
        closeOpen = hide
        setOpen(true)
    }, [hide])

    const place = useCallback(() => {
        const r = trigger.current?.getBoundingClientRect()
        const el = tip.current
        if (!r || !el) {
            return
        }
        const { width, height } = el.getBoundingClientRect()
        const vw = document.documentElement.clientWidth
        const vh = window.innerHeight
        let top = r.top - GAP - height
        if (top < MARGIN) {
            top = Math.min(r.bottom + GAP, vh - MARGIN - height)
        }
        const left = Math.min(Math.max(MARGIN, r.left + (r.width - width) / 2), vw - MARGIN - width)
        el.style.top = `${Math.max(MARGIN, top)}px`
        el.style.left = `${Math.max(MARGIN, left)}px`
    }, [])

    // placed before the paint: no jump
    useLayoutEffect(() => {
        if (open) {
            place()
        }
    }, [open, place, content])

    useEffect(() => {
        if (!open) {
            return
        }
        const onDown = (e: PointerEvent) => {
            if (!trigger.current?.contains(e.target as Node)) {
                hide()
            }
        }
        // a focused trigger is followed (focus itself may scroll it into view); hover and touch close
        const onScroll = () => (via.current === 'focus' ? place() : hide())
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                hide()
                e.stopPropagation() // the tooltip, not the modal under it
            }
        }
        document.addEventListener('pointerdown', onDown, true)
        window.addEventListener('scroll', onScroll, true)
        window.addEventListener('resize', hide)
        window.addEventListener('keyup', onKey, true)

        return () => {
            document.removeEventListener('pointerdown', onDown, true)
            window.removeEventListener('scroll', onScroll, true)
            window.removeEventListener('resize', hide)
            window.removeEventListener('keyup', onKey, true)
        }
    }, [open, hide, place])

    useEffect(() => () => {
        clearTimeout(timer.current)
        if (closeOpen === hide) {
            closeOpen = null
        }
    }, [hide])

    if (!content) {
        return children
    }

    const own = children.props
    const chain = <E extends SyntheticEvent>(name: string, handler: (e: E) => void) => (e: E) => {
        own[name]?.(e)
        handler(e)
    }

    return (
        <>
            {cloneElement(children, {
                ref: trigger,
                tabIndex: own.tabIndex ?? (FOCUSABLE.includes(children.type as string) ? undefined : 0),
                'aria-describedby': id,
                onPointerEnter: chain('onPointerEnter', (e: ReactPointerEvent) => {
                    if (e.pointerType === 'mouse') {
                        clearTimeout(timer.current)
                        timer.current = setTimeout(() => show('hover'), DELAY)
                    }
                }),
                onPointerLeave: chain('onPointerLeave', (e: ReactPointerEvent) => {
                    if (e.pointerType === 'mouse') {
                        clearTimeout(timer.current)
                        if (via.current === 'hover') {
                            hide()
                        }
                    }
                }),
                onPointerDown: chain('onPointerDown', (e: ReactPointerEvent) => {
                    touch.current = e.pointerType !== 'mouse'
                }),
                onClick: chain('onClick', (e: SyntheticEvent) => {
                    // a button or a link inside the trigger keeps its tap for its action
                    const action = (e.target as Element).closest('a, button')
                    if (touch.current && !own.onClick && !(action && trigger.current?.contains(action))) {
                        if (open) {
                            hide()
                        } else {
                            show('touch')
                        }
                    }
                }),
                onFocus: chain('onFocus', (e: SyntheticEvent) => {
                    if ((e.currentTarget as Element).matches(':focus-visible')) {
                        show('focus')
                    }
                }),
                onBlur: chain('onBlur', () => {
                    if (via.current === 'focus') {
                        hide()
                    }
                }),
            })}
            {createPortal(
                <span ref={tip} id={id} role="tooltip" className="tooltip" hidden={!open}>{content}</span>,
                document.getElementById('app') || document.body,
            )}
        </>
    )
}
