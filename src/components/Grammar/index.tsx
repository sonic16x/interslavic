import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { setPageAction } from 'actions';

interface IGrammarProps {
    close: () => void;
    isVisible: boolean;
}

class Grammar extends React.Component<IGrammarProps> {
    public render() {
        return (
            <div className={'grammar' + (this.props.isVisible ? ' show' : '')}>
                asdasd
            </div>
        );
    }
}

function mapStateToProps({page, isLoading}) {
    return {
        isVisible: page === 'grammar' && !isLoading,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        close: () => dispatch(setPageAction('translator')),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Grammar);
