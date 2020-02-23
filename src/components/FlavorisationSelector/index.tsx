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
        name: 'Etimologičny pravopis',
        value: '2',
    },
    {
        name: 'Medžuslovjansky',
        value: '3',
    },
    {
        name: 'Slovianto',
        value: '4',
    },
    {
        name: 'Sěverny variant',
        value: 'S',
    },
    {
        name: 'Južny variant',
        value: 'J',
    },
];

const FlavorisationSelectorInternal: React.FC<IFlavorisationSelectorInternalProps> =
    ({changeFlavorisationType, flavorisationType}: IFlavorisationSelectorInternalProps) => (
        <Selector
            className={'flavorisation-selector'}
            options={flavorisationTypes}
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
