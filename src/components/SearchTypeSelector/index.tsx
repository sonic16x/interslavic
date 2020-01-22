import { searchTypeAction } from 'actions';
import { connect } from 'connect';
import * as React from 'react';
import { t } from 'translations';
import { LineSelector } from '../LineSelector';
import './index.scss';

interface IFlavorisationSelectorProps {
    searchType: string;
    changeSearchType: (searchType: string) => void;
}

const searchTypes = [
    {
        name: 'searchTypeBegin',
        value: 'begin',
    },
    {
        name: 'searchTypeEntire',
        value: 'full',
    },
    /*{
        name: 'searchTypeEnd',
        value: 'end',
    },*/
    {
        name: 'searchTypeAny',
        value: 'some',
    },
];

class SearchTypeSelector extends React.Component<IFlavorisationSelectorProps> {
    public render() {
        return (
            <LineSelector
                className={'searchTypeSelector'}
                options={searchTypes.map((item) => ({
                    name: t(item.name),
                    value: item.value,
                }))}
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
