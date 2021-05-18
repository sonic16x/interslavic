import { render } from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import FilterIcon from './images/filter-icon.svg';
import FilterRemoveIcon from './images/filter-remove-icon.svg';
import SortArrowIcon from './images/sort-arrow-icon.svg';

const HeaderComponentReact = ({ agParams }: { agParams: any }) => {
    const [sort, setSort] = useState<'asc' | 'desc' | null>(agParams.column.getSort());
    const [isFilter, setFilter] = useState<boolean>(agParams.column.isFilterActive());
    const filterRef = useRef();
    const fieldId = agParams.column.colId;

    const onSortClick = useCallback(() => {
        switch (agParams.column.getSort()) {
            case 'asc':
                return agParams.setSort('desc');
            case 'desc':
                return agParams.setSort(null);
            default:
                return agParams.setSort('asc');
        }
    }, []);

    const onFilterClick = useCallback(() => {
        if (filterRef && filterRef.current) {
            agParams.showColumnMenu(filterRef.current);
        }
    }, [filterRef]);

    const onSortChanged = useCallback(() => {
        setSort(agParams.column.getSort());
    }, [setSort]);

    const onFilterChanged = useCallback(() => {
        setFilter(agParams.column.isFilterActive());
    }, [setSort]);

    const onFilterRemoveClick = useCallback(() => {
        const currentFilter = agParams.api.getFilterModel();
        delete currentFilter[fieldId];
        agParams.api.setFilterModel(currentFilter);
    }, [setSort, fieldId]);

    useEffect(() => {
        agParams.column.addEventListener('sortChanged', onSortChanged);
        agParams.column.addEventListener('filterChanged', onFilterChanged);

        return () => {
            agParams.column.removeEventListener('sortChanged', onSortChanged);
            agParams.column.removeEventListener('filterChanged', onFilterChanged);
        };
    }, []);

    return (
        <>
            <span
                className={'viewer__ag-header-cell-start-container'}
            >
                <span
                    className={'viewer__ag-header-cell-sort'}
                    onClick={onSortClick}
                >
                    <span
                        className={classNames('viewer__ag-header-cell-sort-arrow', {
                            'rotated': true,
                            'primary-color': sort === 'asc',
                            'muted-color': sort !== 'asc',
                        })}
                    >
                        <SortArrowIcon/>
                    </span>
                    <span
                        className={classNames('viewer__ag-header-cell-sort-arrow', {
                            'primary-color': sort === 'desc',
                            'muted-color': sort !== 'desc',
                        })}
                    >
                        <SortArrowIcon/>
                    </span>
                </span>
                <span className={'viewer__ag-header-cell-label'}>
                    {agParams.displayName}
                </span>
            </span>
            <span
                className={'viewer__ag-header-cell-filter-container'}
            >
                <span
                    className={classNames('viewer__ag-header-cell-filter', {
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
                        className={'viewer__ag-header-cell-filter-remove'}
                        onClick={onFilterRemoveClick}
                    >
                        <FilterRemoveIcon/>
                    </span>
                )}
            </span>
        </>
    );
};

export class ViewerHeaderComponent {
    private agParams: any;
    private mainElement: HTMLDivElement;

    public init(agParams) {
        this.agParams = agParams;
        this.mainElement = document.createElement('div');
        this.mainElement.className = 'viewer__ag-header-cell';

        render(<HeaderComponentReact agParams={agParams} />, this.mainElement);
    }

    public getGui() {
        return this.mainElement;
    }
}
