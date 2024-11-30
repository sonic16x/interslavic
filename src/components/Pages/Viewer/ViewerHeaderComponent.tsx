import classNames from 'classnames'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'

import './ViewerHeaderComponent.scss'

import FilterIcon from './images/filter-icon.svg'
import FilterRemoveIcon from './images/filter-remove-icon.svg'
import SortArrowIcon from './images/sort-arrow-icon.svg'

const ViewerHeaderComponentReact = ({ agParams }: { agParams: any }) => {
    const [sort, setSort] = useState<'asc' | 'desc' | null>(agParams.column.getSort())
    const [isFilter, setFilter] = useState<boolean>(agParams.column.isFilterActive())
    const filterRef = useRef()
    const fieldId = agParams.column.colId

    const onSortClick = () => {
        switch (agParams.column.getSort()) {
            case 'asc':
                return agParams.setSort('desc')
            case 'desc':
                return agParams.setSort(null)
            default:
                return agParams.setSort('asc')
        }
    }

    const onFilterClick = () => {
        if (filterRef && filterRef.current) {
            agParams.showColumnMenu(filterRef.current)
        }
    }

    const onSortChanged = useCallback(() => {
        setSort(agParams.column.getSort())
    }, [setSort, agParams.column])

    const onFilterChanged = useCallback(() => {
        setFilter(agParams.column.isFilterActive())
    }, [setFilter, agParams.column])

    const onFilterRemoveClick = () => {
        const currentFilter = agParams.api.getFilterModel()
        delete currentFilter[fieldId]
        agParams.api.setFilterModel(currentFilter)
    }

    useEffect(() => {
        agParams.column.addEventListener('sortChanged', onSortChanged)
        agParams.column.addEventListener('filterChanged', onFilterChanged)

        return () => {
            agParams.column.removeEventListener('sortChanged', onSortChanged)
            agParams.column.removeEventListener('filterChanged', onFilterChanged)
        }
    }, [agParams.column, onSortChanged, onFilterChanged])

    return (
        <>
            <span
                className="header-cell__start-container"
            >
                <span
                    className="header-cell__sort"
                    onClick={onSortClick}
                >
                    <span
                        className={classNames('header-cell__sort-arrow', {
                            'rotated': true,
                            'primary-color': sort === 'asc',
                            'muted-color': sort !== 'asc',
                        })}
                    >
                        <SortArrowIcon/>
                    </span>
                    <span
                        className={classNames('header-cell__sort-arrow', {
                            'primary-color': sort === 'desc',
                            'muted-color': sort !== 'desc',
                        })}
                    >
                        <SortArrowIcon/>
                    </span>
                </span>
                <span className="header-cell__label">
                    {agParams.displayName}
                </span>
            </span>
            <span
                className="header-cell__filter-container"
            >
                <span
                    className={classNames('header-cell__filter', {
                        'muted-color': !isFilter,
                        'primary-color': isFilter,
                    })}
                    ref={filterRef}
                    onClick={onFilterClick}
                >
                    <FilterIcon/>
                </span>
                {isFilter && (
                    <span
                        className="header-cell__filter-remove"
                        onClick={onFilterRemoveClick}
                    >
                        <FilterRemoveIcon/>
                    </span>
                )}
            </span>
        </>
    )
}

export class ViewerHeaderComponent {
    private agParams: any
    private mainElement: HTMLDivElement

    public init(agParams) {
        this.agParams = agParams
        this.mainElement = document.createElement('div')
        this.mainElement.className = 'header-cell'

        createRoot(this.mainElement).render(
            <ViewerHeaderComponentReact agParams={agParams} />
        )
    }

    public getGui() {
        return this.mainElement
    }
}
