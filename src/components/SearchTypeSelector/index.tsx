import { searchTypeAction } from 'actions';
import * as React from 'react';
import { t } from 'translations';
import { LineSelector } from '../LineSelector';
import './index.scss';
import { useDispatch } from 'react-redux';
import { useSearchType } from 'hooks/useSearchType';

const searchTypes = [
    {
        name: 'searchTypeBegin',
        value: 'begin',
    },
    {
        name: 'searchTypeEntire',
        value: 'full',
    },
    // {
    //     name: 'searchTypeEnd',
    //     value: 'end',
    // },
    {
        name: 'searchTypeAny',
        value: 'some',
    },
];

export const SearchTypeSelector: React.FC =
    () => {
        const dispatch = useDispatch();
        const searchType = useSearchType();
        const onSelect = React.useCallback((searchType) => {
            dispatch(searchTypeAction(searchType));
        }, [dispatch]);
        const options = searchTypes.map((item) => ({
            name: t(item.name),
            value: item.value,
        }));

        return (
            <LineSelector
                className={'search-type-selector'}
                options={options}
                value={searchType}
                onSelect={onSelect}
            />
        );
    };
