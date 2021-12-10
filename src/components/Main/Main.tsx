import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchDictionary } from 'services/fetchDictionary';

import { useDictionaryLanguages } from 'hooks/useDictionaryLanguages';

import { GDPR } from 'components/GDPR';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import { ModalDialog } from 'components/ModalDialog';
import { Notification } from 'components/Notification';
import { Router } from 'components/Router';

import './Main.scss';

export const Main =
    () => {
        const dispatch = useDispatch();
        const dictionaryLanguages = useDictionaryLanguages();

        useEffect(() => {
            async function fetchAll() {
                await fetchDictionary(dispatch, dictionaryLanguages);
            }

            fetchAll();
        }, [dispatch, dictionaryLanguages]);

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
