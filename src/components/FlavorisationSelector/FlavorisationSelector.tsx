import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { t } from 'translations';

import { flavorisationTypeAction } from 'actions';

import { useFlavorisationType } from 'hooks/useFlavorisationType';

import { Selector } from 'components/Selector';

import './FlavorisationSelector.scss';

const flavorisationTypes = [
    {
        name: 'flavEtymological',
        value: '2',
    },
    {
        name: 'flavStandard',
        value: '3',
    },
    {
        name: 'flavSlovianto',
        value: '4',
    },
    {
        name: 'flavNorthern',
        value: 'S',
    },
    {
        name: 'flavSouthern',
        value: 'J',
    },
];

export const FlavorisationSelector =
    () => {
        const dispatch = useDispatch();
        const flavorisationType = useFlavorisationType();
        const options = flavorisationTypes.map(({ name, value }) => ({
            name: t(name),
            value,
        }));
        const onSelect = useCallback((type) => {
            dispatch(flavorisationTypeAction(type));
        }, [dispatch]);

        return (
            <Selector
                className="flavorisation-selector"
                options={options}
                onSelect={onSelect}
                value={flavorisationType}
                label={t('flavorisation')}
            />
        );
    };
