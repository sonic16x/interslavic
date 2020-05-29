import React from 'react';
import { useDispatch } from 'react-redux';

import { GDPR } from 'components/GDPR';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import { Notification } from 'components/Notification';
import { ModalDialog } from 'components/ModalDialog';
import { Router } from 'components/Router';

import { fetchDictionary } from 'services/fetchDictionary';
import './index.scss';

export const Main: React.FC =
    () => {
        const dispatch = useDispatch();
        React.useEffect(() => fetchDictionary(dispatch));

        return (
            <>
                <Header/>
                <Router/>
                <GDPR/>
                <Loader/>
                <ModalDialog/>
                <Notification/>
            </>
        );
    };
