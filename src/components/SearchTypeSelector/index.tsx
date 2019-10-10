import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { searchTypeAction } from 'actions';
import { LineSelector } from '../LineSelector';

interface IFlavorisationSelectorProps {
    searchType: string;
    changeSearchType: (searchType: string) => void;
}

const searchTypes = [
    {
        name: 'Begin',
        value: 'begin',
    },
    {
        name: 'Entire',
        value: 'full',
    },
    {
        name: 'Any',
        value: 'some',
    },
];

class SearchTypeSelector extends React.Component<IFlavorisationSelectorProps> {
    public render() {
        return (
            <LineSelector
                options={searchTypes}
                value={this.props.searchType}
                onSelect={(searchType) => this.props.changeSearchType(searchType)}
            />
        );
    }
}

function mapStateToProps({searchType}) {
    return {
        searchType,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changeSearchType: (searchType) => dispatch(searchTypeAction(searchType)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchTypeSelector);
