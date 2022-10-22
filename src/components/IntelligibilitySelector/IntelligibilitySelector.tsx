import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { t } from 'translations';

import { intelligibilityFilterAction } from 'actions';

import { useIntelligibilityFilter } from 'hooks/useIntelligibilityFilter';

import { Selector } from 'components/Selector';

import { langs } from "../../consts";

import './IntelligibilitySelector.scss';

const sortedLangs = [...langs].sort();

export const IntelligibilitySelector =
    () => {
        const dispatch = useDispatch();
        const intelligibilityFilter = useIntelligibilityFilter();
        const options = ['', ...sortedLangs].map((value) => ({
            name: value ? t(`${value}Lang`) : t('anyLanguage'),
            value,
        }));
        const onSelect = useCallback((pos) => {
            dispatch(intelligibilityFilterAction(pos));
        }, [dispatch]);

        return (
            <Selector
                className="intelligibility-selector"
                options={options}
                onSelect={onSelect}
                value={intelligibilityFilter}
                label={t('targetLanguage')}
            />
        );
    };
