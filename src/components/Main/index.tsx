import React from 'react';
import { connect } from 'connect';
import Header from 'components/Header';
import DetailModal from 'components/DetailModal';
import Router from 'components/Router';
import { Loader } from 'components/Loader';
import GDPR from 'components/GDPR';
import { t } from 'translations';

import './index.scss';
import { fetchDictionary } from 'actions';

interface IMainProps {
    isLoading: boolean;
    loadDictionary: () => void;
}

class Main extends React.Component<IMainProps> {
    constructor(props) {
        super(props);
        this.props.loadDictionary();
    }

    public render() {
        return (
            <>
                <GDPR/>
                <Loader title={t('loading')} isLoading={this.props.isLoading}/>
                <Header/>
                <DetailModal/>
                <Router/>
            </>
        );
    }
}

function mapStateToProps({ isLoading }) {
    return { isLoading };
}

function mapDispatchToProps(dispatch) {
    return {
        loadDictionary: () => fetchDictionary(dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
