import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { flavorisationTypeAction } from 'actions';
import { Selector } from 'components/Selector';

interface IFlavorisationSelectorProps {
    flavorisationType: string;
    changeFlavorisationType: (flavorisationType: string) => void;
}

const flavorisationTypes = [
    {
        name: 'Naučny MS',
        value: '2',
    },
    {
        name: 'Medžuslovjansky',
        value: '3',
    },
    {
        name: 'MS Jotovana kirilica',
        value: '3NC',
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

class FlavorisationSelector extends React.Component<IFlavorisationSelectorProps> {
    public render() {
        return (
            <div className={'flav'}>
                <label>Flavorisation</label>
                <Selector
                    options={flavorisationTypes}
                    onSelect={(flavorisationType) => this.props.changeFlavorisationType(flavorisationType)}
                    value={this.props.flavorisationType}
                />
            </div>
        );
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(FlavorisationSelector);
