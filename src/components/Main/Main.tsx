import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchDictionary } from 'services/fetchDictionary';

import { useDarkTheme } from 'hooks/useDarkTheme';
import { useDictionaryLanguages } from 'hooks/useDictionaryLanguages';

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
        const isDarkTheme = useDarkTheme();
        const theme = isDarkTheme ? 'dark' : 'light';

        useEffect(() => {
            document.getElementById('app').className='color-theme--' + theme;

            (async () => {
                await fetchDictionary(dispatch, dictionaryLanguages);
            })()
        }, [dispatch, dictionaryLanguages, theme]);

        return (
            <>
                <Header/>
                <Router/>
                <Loader/>
                <ModalDialog/>
                <Notification/>
            </>
        );
    };
