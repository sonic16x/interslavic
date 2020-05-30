import React from 'react';
import { useDispatch } from 'react-redux';

import { GDPR } from 'components/GDPR';
import { Header } from 'components/Header';
import { Banner } from 'components/Banner';
import { Loader } from 'components/Loader';
import { Notification } from 'components/Notification';
import { ModalDialog } from 'components/ModalDialog';
import { Router } from 'components/Router';

import { fetchDictionary } from 'services/fetchDictionary';
import './index.scss';
import { useDictionaryLanguages } from 'hooks/useDictionaryLanguages';

export const Main: React.FC =
    () => {
        const dispatch = useDispatch();
        const dictionaryLanguages = useDictionaryLanguages();
        React.useEffect( () => {
                async function fetchAll() {
                        await fetchDictionary(dispatch, dictionaryLanguages);
                }

                fetchAll();
        }, []);

        return (
            <>
                {/*<Banner/>*/}
                <Header/>
                <Router/>
                <GDPR/>
                <Loader/>
                <ModalDialog/>
                <Notification/>
            </>
        );
    };
