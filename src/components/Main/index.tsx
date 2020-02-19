import DetailModal from 'components/DetailModal';
import GDPR from 'components/GDPR';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import Router from 'components/Router';
import { connect } from 'connect';
import React from 'react';
import { t } from 'translations';

import { fetchDictionary } from 'services';
import './index.scss';

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
