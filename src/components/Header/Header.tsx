import classNames from 'classnames'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import { t } from 'translations'

import { setPageAction } from 'actions'

import {
    useBadges,
    useEnabledPages,
    useInterfaceLang,
    usePage,
} from 'hooks'
import { defaultPages, pages } from 'routing'

import './Header.scss'

import LogoIcon from './images/logo-icon.svg'

export const Header =
    () => {
        useInterfaceLang()

        const dispatch = useDispatch()
        const page = usePage()
        const badges = useBadges()
        const [menuIsVisible, setMenuIsVisible] = useState(false)
        const [mobile, setMobile] = useState(false)
        const [menuAnim, setMenuAnim] = useState(false)
        const collapseMenu = useCallback(() => setMenuIsVisible(false), [setMenuIsVisible])
        const enabledPages = useEnabledPages()
        const navRef = useRef<HTMLDivElement>()
        const logoRef = useRef<HTMLDivElement>()
        const navRefWidth = useRef<number>(0)

        const onResize = useCallback(() => {
            if (navRef && navRef.current && logoRef && logoRef.current) {
                const windowWidth = document.body.clientWidth
                const logoWidth = logoRef.current.getBoundingClientRect().width

                if (!navRefWidth.current) {
                    navRefWidth.current = navRef.current.getBoundingClientRect().width
                }

                const full = windowWidth > 1052
                const mobile = !full && ((logoWidth + navRefWidth.current + 20) > windowWidth)

                setMobile(mobile)
            }
        }, [navRef, logoRef])

        useEffect(() => {
            window.addEventListener('resize', onResize)

            return () => {
                window.removeEventListener('resize', onResize)
            }
        }, [onResize])

        useEffect(() => {
            onResize()
        }, [navRef, logoRef, enabledPages, onResize])
        
        const filteredPages = useMemo(() => (
            pages.filter(({ value }) => (defaultPages.includes(value) || enabledPages.includes(value)))
        ), [pages, enabledPages])

        const showBadges = useMemo(() => (
            filteredPages.some(({ value }) => (badges.includes(value)))
        ), [badges, filteredPages])

        return (
            <header
                className={classNames('header', 'color-theme--light', { active: menuIsVisible, mobile })}
            >
                <h1
                    className="logo"
                    ref={logoRef}
                >
                    <span
                        className="logo-img"
                        onClick={() => {
                            dispatch(setPageAction('dictionary'))
                            setMenuIsVisible(false)
                        }}
                    >
                        <LogoIcon/>
                    </span>
                    <span className="logo-text" data-testid="main-title">
                        {t('mainTitle')}
                    </span>
                </h1>
                <button
                    type="button"
                    className={classNames('show-menu-button', { 'expanded': menuIsVisible, 'badge': showBadges })}
                    aria-label="Menu button"
                    onClick={() => {
                        setMenuIsVisible(!menuIsVisible)
                        setMenuAnim(true)
                    }}
                >
                    <span className={classNames('lines', { active: menuIsVisible })}/>
                </button>
                <nav
                    className={classNames('menu', { active: menuIsVisible, anim: menuAnim })}
                    ref={navRef}
                >
                    {filteredPages.map((({ title, value, subTitle }) => (
                        <MenuItem
                            key={value}
                            title={title}
                            subTitle={subTitle}
                            value={value}
                            active={page === value}
                            hasBadge={badges.includes(value)}
                            onClick={collapseMenu}
                        />
                    )))}
                </nav>
            </header>
        )
    }

interface IMenuItemProps {
    title: string;
    subTitle?: string;
    value: string;
    hasBadge?: boolean;
    active: boolean;
    onClick: () => void;
}

const MenuItem = ({
    title,
    subTitle,
    value,
    active,
    onClick: customOnClick,
    hasBadge,
}: IMenuItemProps) => {
    const dispatch = useDispatch()
    const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        dispatch(setPageAction(value))
        customOnClick()
    }

    return (
        <a
            className={classNames('menu-item', { active, 'badge': hasBadge })}
            onClick={onClick}
            data-sub-title={subTitle}
            href={`/${value}`}
        >
            {t(title)}
        </a>
    )
}
