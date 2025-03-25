import { useEffect, useState } from 'react'

export function useScrollbarWidth(): number {
    const [width, setWidth] = useState(0)

    useEffect(() => {
        const el = document.createElement('div')
        el.style.cssText = 'overflow:scroll; visibility:hidden; position:absolute;'
        document.body.appendChild(el)
        setWidth(el.offsetWidth - el.clientWidth)
        el.remove()
    }, [])

    return width
}
