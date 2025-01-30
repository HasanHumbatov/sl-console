import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import config from '../config';

const IgnoreList = () => {
  const [appNames, setAppNames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAppNames, setFilteredAppNames] = useState([]);
  const [selectedAppName, setSelectedAppName] = useState('');
  const [ignoreRules, setIgnoreRules] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [popup, setPopup] = useState({ visible: false, email: '', x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const popupRef = useRef(null);

  // Fetch app names
  useEffect(() => {
    const fetchAppNames = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          'https://plutotv.sealights.co/sl-api/v1/apps',
          {
            headers: {
              Authorization: config.AUTH_TOKEN,
            },
          }
        );
        const apps = response.data.data.apps.map((app) => app.appName);
        setAppNames(apps);
        setFilteredAppNames(apps);
      } catch (error) {
        console.error('Error fetching app names:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppNames();
  }, []);

  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isDropdownOpen]);

  // Fetch ignore rules when an app is selected
  useEffect(() => {
    const fetchIgnoreRules = async () => {
      if (selectedAppName) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `https://plutotv.sealights.co/sl-api/v1/settings/apps/${selectedAppName}/ignore-rules`,
            {
              headers: {
                Authorization: config.AUTH_TOKEN,
              },
            }
          );
          console.log('Ignore rules response:', response.data.data.records); // Debug log
          setIgnoreRules(response.data.data.records);
        } catch (error) {
          console.error('Error fetching ignore rules:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchIgnoreRules();
  }, [selectedAppName]);

  useEffect(() => {
    setFilteredAppNames(
      appNames.filter((appName) =>
        appName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, appNames]);

  const handleKeyDown = useCallback(
    (event) => {
      if (!isDropdownOpen) return;

      if (event.key === 'ArrowDown') {
        setActiveIndex(
          (prevIndex) => (prevIndex + 1) % filteredAppNames.length
        );
      } else if (event.key === 'ArrowUp') {
        setActiveIndex(
          (prevIndex) =>
            (prevIndex - 1 + filteredAppNames.length) % filteredAppNames.length
        );
      } else if (event.key === 'Enter' && activeIndex >= 0) {
        handleAppSelect(filteredAppNames[activeIndex]);
      }
    },
    [isDropdownOpen, activeIndex, filteredAppNames]
  );

  const handleAppSelect = (appName) => {
    setSelectedAppName(appName);
    setIsDropdownOpen(false);
    setSearchTerm('');
    setActiveIndex(-1);
  };

  const handleNameClick = (email, event) => {
    const rect = event.target.getBoundingClientRect();
    setPopup({
      visible: true,
      email,
      x: rect.left,
      y: rect.bottom,
    });
  };

  const closePopup = () => {
    setPopup({ visible: false, email: '', x: 0, y: 0 });
  };

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      closePopup();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Ignore Rules</h1>

      <div className='relative mb-4 w-1/5' ref={dropdownRef}>
        <div className='flex items-center'>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-left w-full'
          >
            {selectedAppName || 'Select service name'}
            <span className='float-right'>
              {isDropdownOpen ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 inline-block'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 inline-block'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M14.707 10.707a1 1 0 01-1.414 0L10 7.414 6.707 10.707a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              )}
            </span>
          </button>
          {isLoading && (
            <svg
              className='animate-spin h-5 w-5 text-blue-500 ml-2'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
              ></path>
            </svg>
          )}
        </div>

        {isDropdownOpen && (
          <div className='absolute bg-white border rounded-lg shadow-lg w-full mt-2 z-10'>
            <input
              type='text'
              placeholder='Search...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-4 py-2 border-b focus:outline-none'
              onKeyDown={handleKeyDown}
              ref={searchInputRef}
            />
            <ul className='max-h-60 overflow-y-auto'>
              {filteredAppNames.map((appName, index) => (
                <li
                  key={index}
                  onClick={() => handleAppSelect(appName)}
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                    activeIndex === index ? 'bg-blue-100' : ''
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {appName}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {selectedAppName ? (
        ignoreRules.length > 0 ? (
          <table className='min-w-full bg-white border-collapse border border-gray-200'>
            <thead>
              <tr>
                <th className='border border-gray-300 px-4 py-2'>#</th>
                <th className='border border-gray-300 px-4 py-2'>Scope</th>
                <th className='border border-gray-300 px-4 py-2'>Path</th>
                <th className='border border-gray-300 px-4 py-2'>Created By</th>
                <th className='border border-gray-300 px-4 py-2'>Condition</th>
                <th className='border border-gray-300 px-4 py-2'>Reason</th>
              </tr>
            </thead>
            <tbody>
              {ignoreRules.map((rule, index) => (
                <tr key={rule.ruleId}>
                  <td className='border border-gray-300 px-4 py-2'>
                    {index + 1}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    {rule.scope}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    {rule.path}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    <span
                      className='underline cursor-pointer text-blue-600 popup-trigger'
                      onClick={(event) =>
                        handleNameClick(rule.createdBy.email, event)
                      }
                    >
                      {rule.createdBy.firstName} {rule.createdBy.lastName}
                    </span>
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    {rule.condition || 'N/A'}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    {rule.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className='text-gray-500'>
            No ignore rules available for this service.
          </p>
        )
      ) : (
        <p className='text-gray-500'>Select service name . . .</p>
      )}
      {popup.visible && (
        <div
          className='absolute bg-white border rounded-lg shadow-lg p-2'
          style={{ top: popup.y, left: popup.x }}
          ref={popupRef}
          onClick={closePopup}
        >
          {popup.email}
        </div>
      )}
    </div>
  );
};

export default IgnoreList;
