import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchCommunityLinks } from 'services/fetchCommunityLinks';
import { fetchDictionary } from 'services/fetchDictionary';

import { useCommunityLinks } from 'hooks/useCommunityLinks';
import { useDarkTheme } from 'hooks/useDarkTheme';
import { useDictionaryLanguages } from 'hooks/useDictionaryLanguages';

import { GDPR } from 'components/GDPR';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import { ModalDialog } from 'components/Modals/ModalDialog';
import { Notification } from 'components/Notification';
import { Router } from 'components/Router';

import './Main.scss';

export const Main =
    () => {
        const dispatch = useDispatch();
        const dictionaryLanguages = useDictionaryLanguages();
        const communityLinks = useCommunityLinks();
        const isDarkTheme = useDarkTheme();
        const theme = isDarkTheme ? 'dark' : 'light';

        useEffect(() => {
            async function fetchAll() {
                await fetchDictionary(dispatch, dictionaryLanguages);
                await fetchCommunityLinks(dispatch, communityLinks);
            }

            fetchAll();
            document.getElementById('app').className='color-theme--' + theme;
        }, [dispatch, dictionaryLanguages, theme]);

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
