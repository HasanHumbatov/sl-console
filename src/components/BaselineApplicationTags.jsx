import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import config from '../config';

const BaselineApplicationTags = () => {
  const [appNames, setAppNames] = useState([]);
  const [branchNames, setBranchNames] = useState([]);
  const [searchTermApp, setSearchTermApp] = useState('');
  const [searchTermBranch, setSearchTermBranch] = useState('');
  const [filteredAppNames, setFilteredAppNames] = useState([]);
  const [filteredBranchNames, setFilteredBranchNames] = useState([]);
  const [selectedAppName, setSelectedAppName] = useState('');
  const [selectedBranchName, setSelectedBranchName] = useState('');
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [highlightedIndexApp, setHighlightedIndexApp] = useState(-1);
  const [highlightedIndexBranch, setHighlightedIndexBranch] = useState(-1);
  const appDropdownRef = useRef(null);
  const branchDropdownRef = useRef(null);
  const appSearchInputRef = useRef(null);
  const branchSearchInputRef = useRef(null);

  // Fetch app names
  useEffect(() => {
    setIsLoadingApps(true);
    axios
      .get('https://plutotv.sealights.co/sl-api/v1/apps', {
        headers: {
          Authorization: config.AUTH_TOKEN,
        },
      })
      .then((response) => {
        const apps = response.data.data.apps.map((app) => app.appName);
        setAppNames(apps);
        setFilteredAppNames(apps);
        setIsLoadingApps(false);
      })
      .catch((error) => {
        console.error('Error fetching app names:', error);
        setIsLoadingApps(false);
      });
  }, []);

  // Fetch branch names when an appName is selected
  useEffect(() => {
    if (selectedAppName) {
      setIsLoadingBranches(true);
      axios
        .get(
          `https://plutotv.sealights.co/sl-api/v1/apps/${selectedAppName}/branches`,
          {
            headers: {
              Authorization: config.AUTH_TOKEN,
            },
          }
        )
        .then((response) => {
          const branches = response.data.data.branches.map(
            (branch) => branch.branchName
          );
          setBranchNames(branches);
          setFilteredBranchNames(branches);
          setIsLoadingBranches(false);
        })
        .catch((error) => {
          console.error('Error fetching branch names:', error);
          setIsLoadingBranches(false);
        });
    }
  }, [selectedAppName]);

  // Fetch builds data when appName or branchName is selected
  // useEffect(() => {
  //   if (selectedAppName) {
  //     const branchQuery = selectedBranchName
  //       ? `?branchName=${selectedBranchName}`
  //       : '';
  //     axios
  //       .get(
  //         `https://plutotv.sealights.co/sl-api/v1/builds/apps/${selectedAppName}/filter${branchQuery}`,
  //         {
  //           headers: {
  //             Authorization: config.AUTH_TOKEN,
  //           },
  //         }
  //       )
  //       .then((response) => {
  //         setBuilds(response.data.data.list);
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching builds data:', error);
  //       });
  //   }
  // }, [selectedAppName, selectedBranchName]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        appDropdownRef.current &&
        !appDropdownRef.current.contains(event.target)
      ) {
        setIsAppDropdownOpen(false);
      }
      if (
        branchDropdownRef.current &&
        !branchDropdownRef.current.contains(event.target)
      ) {
        setIsBranchDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAppSelect = (appName) => {
    setSelectedAppName(appName);
    setIsAppDropdownOpen(false);
    setSearchTermApp('');
    setHighlightedIndexApp(-1);
  };

  const handleBranchSelect = (branchName) => {
    setSelectedBranchName(branchName);
    setIsBranchDropdownOpen(false);
    setSearchTermBranch('');
    setHighlightedIndexBranch(-1);
  };

  const handleKeyDownApp = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndexApp((prevIndex) =>
        prevIndex === filteredAppNames.length - 1 ? 0 : prevIndex + 1
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndexApp((prevIndex) =>
        prevIndex <= 0 ? filteredAppNames.length - 1 : prevIndex - 1
      );
    } else if (event.key === 'Enter' && highlightedIndexApp >= 0) {
      handleAppSelect(filteredAppNames[highlightedIndexApp]);
    }
  };

  const handleKeyDownBranch = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndexBranch((prevIndex) =>
        prevIndex === filteredBranchNames.length - 1 ? 0 : prevIndex + 1
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndexBranch((prevIndex) =>
        prevIndex <= 0 ? filteredBranchNames.length - 1 : prevIndex - 1
      );
    } else if (event.key === 'Enter' && highlightedIndexBranch >= 0) {
      handleBranchSelect(filteredBranchNames[highlightedIndexBranch]);
    }
  };

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>
        Sealights Baseline Application Tags
      </h1>
      <div className='flex space-x-4'>
        {/* App Name Dropdown */}
        <div className='relative w-1/5' ref={appDropdownRef}>
          <button
            onClick={() => {
              setIsAppDropdownOpen(!isAppDropdownOpen);
              if (!isAppDropdownOpen) {
                setTimeout(() => appSearchInputRef.current.focus(), 0);
              }
            }}
            className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-left w-full'
          >
            {selectedAppName || 'Select service name'}
          </button>
          {isAppDropdownOpen && (
            <div className='absolute bg-white border rounded-lg shadow-lg w-full mt-2 z-10'>
              <input
                type='text'
                placeholder='Search...'
                value={searchTermApp}
                onChange={(e) => {
                  setSearchTermApp(e.target.value);
                  setFilteredAppNames(
                    appNames.filter((name) =>
                      name.toLowerCase().includes(e.target.value.toLowerCase())
                    )
                  );
                }}
                onKeyDown={handleKeyDownApp}
                className='w-full px-4 py-2 border-b focus:outline-none'
                ref={appSearchInputRef}
              />
              {isLoadingApps ? (
                <div className='flex justify-center py-2'>
                  <div className='loader'></div>
                </div>
              ) : (
                <ul className='max-h-60 overflow-y-auto'>
                  {filteredAppNames.map((appName, index) => (
                    <li
                      key={index}
                      onClick={() => handleAppSelect(appName)}
                      className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                        index === highlightedIndexApp ? 'bg-blue-200' : ''
                      }`}
                    >
                      {appName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Branch Name Dropdown */}
        <div className='relative w-1/5' ref={branchDropdownRef}>
          <button
            onClick={() => {
              if (selectedAppName) {
                setIsBranchDropdownOpen(!isBranchDropdownOpen);
                if (!isBranchDropdownOpen) {
                  setTimeout(() => branchSearchInputRef.current.focus(), 0);
                }
              }
            }}
            className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-left w-full ${
              !selectedAppName ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!selectedAppName}
          >
            {selectedBranchName || 'Select branch name'}
          </button>
          {isBranchDropdownOpen && (
            <div className='absolute bg-white border rounded-lg shadow-lg w-full mt-2 z-10'>
              <input
                type='text'
                placeholder='Search...'
                value={searchTermBranch}
                onChange={(e) => {
                  setSearchTermBranch(e.target.value);
                  setFilteredBranchNames(
                    branchNames.filter((name) =>
                      name.toLowerCase().includes(e.target.value.toLowerCase())
                    )
                  );
                }}
                onKeyDown={handleKeyDownBranch}
                className='w-full px-4 py-2 border-b focus:outline-none'
                ref={branchSearchInputRef}
              />
              {isLoadingBranches ? (
                <div className='flex justify-center py-2'>
                  <div className='loader'></div>
                </div>
              ) : (
                <ul className='max-h-60 overflow-y-auto'>
                  {filteredBranchNames.map((branchName, index) => (
                    <li
                      key={index}
                      onClick={() => handleBranchSelect(branchName)}
                      className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                        index === highlightedIndexBranch ? 'bg-blue-200' : ''
                      }`}
                    >
                      {branchName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BaselineApplicationTags;
