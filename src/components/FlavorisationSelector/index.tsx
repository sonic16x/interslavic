import { flavorisationTypeAction } from 'actions';
import { Selector } from 'components/Selector';
import { connect } from 'react-redux';
import * as React from 'react';
import { t } from 'translations';
import './index.scss';

interface IFlavorisationSelectorInternalProps {
    flavorisationType: string;
    changeFlavorisationType: (flavorisationType: string) => void;
}

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

const FlavorisationSelectorInternal: React.FC<IFlavorisationSelectorInternalProps> =
    ({changeFlavorisationType, flavorisationType}: IFlavorisationSelectorInternalProps) => (
        <Selector
            className={'flavorisation-selector'}
            options={flavorisationTypes.map(({name, value}) => ({
                name: t(name),
                value,
            }))}
            onSelect={(flavorisationType) => changeFlavorisationType(flavorisationType)}
            value={flavorisationType}
            label={t('flavorisation')}
        />
    );

function mapStateToProps({flavorisationType}) {
    return {
        flavorisationType,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changeFlavorisationType: (flavorisationType) => dispatch(flavorisationTypeAction(flavorisationType)),
    };
}

export const FlavorisationSelector = connect(mapStateToProps, mapDispatchToProps)(FlavorisationSelectorInternal);
