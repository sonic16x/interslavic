import { flavorisationTypeAction } from 'actions';
import { Selector } from 'components/Selector';
import * as React from 'react';
import { t } from 'translations';
import './index.scss';
import { useDispatch } from 'react-redux';
import { useFlavorisationType } from 'hooks/useFlavorisationType';

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

export const FlavorisationSelector: React.FC =
    () => {
        const dispatch = useDispatch();
        const flavorisationType = useFlavorisationType();
        const options = flavorisationTypes.map(({name, value}) => ({
            name: t(name),
            value,
        }));
        const onSelect = React.useCallback((type) => {
            dispatch(flavorisationTypeAction(type));
        }, [dispatch]);

        return (
            <Selector
                className={'flavorisation-selector'}
                options={options}
                onSelect={onSelect}
                value={flavorisationType}
                label={t('flavorisation')}
            />
        );
    };
