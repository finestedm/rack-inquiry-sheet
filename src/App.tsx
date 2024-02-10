import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Form from './components/form/Form';
import TopBar from './components/AppBar';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import pl from './features/multilanguage/pl.json'
import en from './features/multilanguage/en.json'
import de from './features/multilanguage/de.json'
import theme, { themeDark } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import MobileScrollButton from './components/MobileScrollButton';
import { useSelector } from 'react-redux';
import { RootState } from './features/redux/store';
import DeleteLoadWarningDialog from './components/form/systemStep/subcomponents/DeleteLoadWarningDialog';
import SimpleSnackbar from './components/SnackBar';
import { useDispatch } from 'react-redux';
import { loadFormDataFromLocalStorage, saveFormDataToLocalStorage } from './features/localStorage/handleLocalStorage';
import { setFormData } from './features/redux/reducers/formDataSlice';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import LevelsConfigs from './components/form/systemStep/subcomponents/RackConfigs/LevelsConfigs';

// Configure i18next
i18n
  .use(LanguageDetector)
  .init({
    resources: {
      pl: { translation: pl },
      en: { translation: en },
      de: { translation: de }
    },
    fallbackLng: 'en', // Fallback to English if the user's language is not supported
    // debug: true, // Enable debug mode for development
    interpolation: {
      escapeValue: false, // React already escapes string, so no need to escape again
    },
  });

function App() {
  const darkMode = useSelector((state: RootState) => state.darkMode)
  const formData = useSelector((state: RootState) => state.formData);
  const dispatch = useDispatch();
  const [initialLoad, setInitialLoad] = useState(true);

  //
  //loading and saving data from localStorage
  //
  useEffect(() => {
    const savedData = loadFormDataFromLocalStorage(formData.version);
    if (savedData) {
      // Check if the loaded version matches the app version before setting the formData
      if (savedData.version === formData.version) {
        dispatch(setFormData(savedData));
        setInitialLoad(false); // Set initialLoad to false after loading
      } else {
        // Handle version mismatch or other errors if needed
      }
    }
  }, []);

  // on first render set the initialLoad to false
  useEffect(() => {
    setInitialLoad(false);
  }, []);

  // Save data to localStorage whenever formData changes
  useEffect(() => {
    if (!initialLoad) {
      saveFormDataToLocalStorage(formData);
    }
  }, [formData]);

  //
  //loading and saving data from localStorage
  //

  //

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={darkMode ? themeDark : theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <SimpleSnackbar />
            <DeleteLoadWarningDialog />
            <TopBar />
            {/* <Form /> */}
            <LevelsConfigs selectedSystem='mpb' />
            <MobileScrollButton />
          </div>
        </Router>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;
