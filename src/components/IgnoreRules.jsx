import { useState, useEffect, useRef, useCallback } from 'react';
import config from '../config';
import fetchAppNames from '../services/fetchAppNames';
import fetchIgnoreRules from '../services/fetchIgnoreRules';
import Dropdown from './IgnoreRules/Dropdown';
import IgnoreRulesTable from './IgnoreRules/IgnoreRulesTable';
import Popup from './IgnoreRules/Popup';

const IgnoreRules = () => {
  const [state, setState] = useState({
    appNames: [],
    searchTerm: '',
    filteredAppNames: [],
    selectedAppName: '',
    ignoreRules: [],
    isDropdownOpen: false,
    activeIndex: -1,
    popup: { visible: false, email: '', x: 0, y: 0 },
    isLoading: false,
  });

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const popupRef = useRef(null);

  // Fetch app names
  useEffect(() => {
    const loadAppNames = async () => {
      setState((prevState) => ({ ...prevState, isLoading: true }));
      try {
        const apps = await fetchAppNames(config.AUTH_TOKEN);
        setState((prevState) => ({
          ...prevState,
          appNames: apps,
          filteredAppNames: apps,
        }));
      } catch (error) {
        console.error('Error fetching app names:', error);
      } finally {
        setState((prevState) => ({ ...prevState, isLoading: false }));
      }
    };

    loadAppNames();
  }, []);

  useEffect(() => {
    if (state.isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [state.isDropdownOpen]);

  // Fetch ignore rules when an app is selected
  useEffect(() => {
    const loadIgnoreRules = async () => {
      if (state.selectedAppName) {
        setState((prevState) => ({ ...prevState, isLoading: true }));
        try {
          const ignoreRules = await fetchIgnoreRules(
            state.selectedAppName,
            config.AUTH_TOKEN
          );
          console.log('Ignore rules response:', ignoreRules); // Debug log
          setState((prevState) => ({
            ...prevState,
            ignoreRules,
          }));
        } catch (error) {
          console.error('Error fetching ignore rules:', error);
        } finally {
          setState((prevState) => ({ ...prevState, isLoading: false }));
        }
      }
    };

    loadIgnoreRules();
  }, [state.selectedAppName]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      filteredAppNames: state.appNames.filter((appName) =>
        appName.toLowerCase().includes(state.searchTerm.toLowerCase())
      ),
    }));
  }, [state.searchTerm, state.appNames]);

  const handleKeyDown = useCallback(
    (event) => {
      if (!state.isDropdownOpen) return;

      if (event.key === 'ArrowDown') {
        setState((prevState) => ({
          ...prevState,
          activeIndex: (state.activeIndex + 1) % state.filteredAppNames.length,
        }));
      } else if (event.key === 'ArrowUp') {
        setState((prevState) => ({
          ...prevState,
          activeIndex:
            (state.activeIndex - 1 + state.filteredAppNames.length) %
            state.filteredAppNames.length,
        }));
      } else if (event.key === 'Enter' && state.activeIndex >= 0) {
        handleAppSelect(state.filteredAppNames[state.activeIndex]);
      }
    },
    [state.isDropdownOpen, state.activeIndex, state.filteredAppNames]
  );

  const handleAppSelect = (appName) => {
    setState((prevState) => ({
      ...prevState,
      selectedAppName: appName,
      isDropdownOpen: false,
      searchTerm: '',
      activeIndex: -1,
    }));
  };

  const handleNameClick = (email, event) => {
    const rect = event.target.getBoundingClientRect();
    setState((prevState) => ({
      ...prevState,
      popup: { visible: true, email, x: rect.left, y: rect.bottom },
    }));
  };

  const closePopup = () => {
    setState((prevState) => ({
      ...prevState,
      popup: { ...prevState.popup, visible: false },
    }));
  };

  const handleClickOutside = useCallback(
    (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setState((prevState) => ({
          ...prevState,
          isDropdownOpen: false,
        }));
      }
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setState((prevState) => ({
          ...prevState,
          popup: { ...prevState.popup, visible: false },
        }));
      }
    },
    [dropdownRef, popupRef]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Ignore Rules</h1>
      <Dropdown
        state={state}
        setState={setState}
        searchInputRef={searchInputRef}
        handleKeyDown={handleKeyDown}
        handleAppSelect={handleAppSelect}
        dropdownRef={dropdownRef}
      />
      {state.selectedAppName ? (
        state.ignoreRules.length > 0 ? (
          <IgnoreRulesTable
            rules={state.ignoreRules}
            handleNameClick={handleNameClick}
          />
        ) : (
          <p className='text-gray-500'>
            No ignore rules available for this service.
          </p>
        )
      ) : (
        <p className='text-gray-500'>Select service name . . .</p>
      )}
      <Popup state={state} popupRef={popupRef} closePopup={closePopup} />
    </div>
  );
};

export default IgnoreRules;
