// import { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import config from '../config';

// const BaselineApplicationTags = () => {
//   const [appNames, setAppNames] = useState([]);
//   const [searchTermApp, setSearchTermApp] = useState('');
//   const [filteredAppNames, setFilteredAppNames] = useState([]);
//   const [selectedAppName, setSelectedAppName] = useState('');
//   const [isAppDropdownOpen, setIsAppDropdownOpen] = useState(false);
//   const [isLoadingApps, setIsLoadingApps] = useState(false);
//   const [highlightedIndexApp, setHighlightedIndexApp] = useState(-1);
//   const appDropdownRef = useRef(null);
//   const appSearchInputRef = useRef(null);

//   // Fetch app names
//   useEffect(() => {
//     setIsLoadingApps(true);
//     axios
//       .get('https://plutotv.sealights.co/sl-api/v1/apps', {
//         headers: {
//           Authorization: config.AUTH_TOKEN,
//         },
//       })
//       .then((response) => {
//         const apps = response.data.data.apps.map((app) => app.appName);
//         setAppNames(apps);
//         setFilteredAppNames(apps);
//         setIsLoadingApps(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching app names:', error);
//         setIsLoadingApps(false);
//       });
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         appDropdownRef.current &&
//         !appDropdownRef.current.contains(event.target)
//       ) {
//         setIsAppDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleAppSelect = (appName) => {
//     setSelectedAppName(appName);
//     setIsAppDropdownOpen(false);
//     setSearchTermApp('');
//     setHighlightedIndexApp(-1);
//   };

//   const handleKeyDownApp = (event) => {
//     if (event.key === 'ArrowDown') {
//       event.preventDefault();
//       setHighlightedIndexApp((prevIndex) =>
//         prevIndex === filteredAppNames.length - 1 ? 0 : prevIndex + 1
//       );
//     } else if (event.key === 'ArrowUp') {
//       event.preventDefault();
//       setHighlightedIndexApp((prevIndex) =>
//         prevIndex <= 0 ? filteredAppNames.length - 1 : prevIndex - 1
//       );
//     } else if (event.key === 'Enter' && highlightedIndexApp >= 0) {
//       handleAppSelect(filteredAppNames[highlightedIndexApp]);
//     }
//   };

//   return (
//     <div className='p-4'>
//       <h1 className='text-2xl font-bold mb-4'>
//         Sealights Baseline Application Tags
//       </h1>
//       <div className='flex space-x-4'>
//         {/* App Name Dropdown */}
//         <div className='relative w-1/5' ref={appDropdownRef}>
//           <button
//             onClick={() => {
//               setIsAppDropdownOpen(!isAppDropdownOpen);
//               if (!isAppDropdownOpen) {
//                 setTimeout(() => appSearchInputRef.current.focus(), 0);
//               }
//             }}
//             className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-left w-full'
//           >
//             {selectedAppName || 'Select service name'}
//           </button>
//           {isAppDropdownOpen && (
//             <div className='absolute bg-white border rounded-lg shadow-lg w-full mt-2 z-10'>
//               <input
//                 type='text'
//                 placeholder='Search...'
//                 value={searchTermApp}
//                 onChange={(e) => {
//                   setSearchTermApp(e.target.value);
//                   setFilteredAppNames(
//                     appNames.filter((name) =>
//                       name.toLowerCase().includes(e.target.value.toLowerCase())
//                     )
//                   );
//                 }}
//                 onKeyDown={handleKeyDownApp}
//                 className='w-full px-4 py-2 border-b focus:outline-none'
//                 ref={appSearchInputRef}
//               />
//               {isLoadingApps ? (
//                 <div className='flex justify-center py-2'>
//                   <div className='loader'></div>
//                 </div>
//               ) : (
//                 <ul className='max-h-60 overflow-y-auto'>
//                   {filteredAppNames.map((appName, index) => (
//                     <li
//                       key={index}
//                       onClick={() => handleAppSelect(appName)}
//                       className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
//                         index === highlightedIndexApp ? 'bg-blue-200' : ''
//                       }`}
//                     >
//                       {appName}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//       {/* Display report data */}
//       {!selectedAppName && (
//         <div className='mt-4 text-gray-500'>Select service name . . .</div>
//       )}
//     </div>
//   );
// };

// export default BaselineApplicationTags;

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import config from '../config';

const BaselineApplicationTags = () => {
  const [appNames, setAppNames] = useState([]);
  const [searchTermApp, setSearchTermApp] = useState('');
  const [filteredAppNames, setFilteredAppNames] = useState([]);
  const [selectedAppName, setSelectedAppName] = useState('');
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState(false);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [highlightedIndexApp, setHighlightedIndexApp] = useState(-1);
  const [responseData, setResponseData] = useState([]);
  const appDropdownRef = useRef(null);
  const appSearchInputRef = useRef(null);

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

  // Fetch build data for selected app
  useEffect(() => {
    if (!selectedAppName) return;

    setIsLoadingApps(true); // Set loading state when fetching data for selected app

    axios
      .get(
        `https://plutotv.sealights.co/sl-api/v1/builds/apps/${selectedAppName}/filter?tag=released`,
        {
          headers: {
            Authorization: config.AUTH_TOKEN,
          },
        }
      )
      .then((response) => {
        setResponseData(response.data.data.list);
        setIsLoadingApps(false); // Hide loading icon after the response
      })
      .catch((error) => {
        console.error('Error fetching build data:', error);
        setIsLoadingApps(false);
      });
  }, [selectedAppName]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        appDropdownRef.current &&
        !appDropdownRef.current.contains(event.target)
      ) {
        setIsAppDropdownOpen(false);
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
            className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-left w-full flex justify-between items-center'
          >
            <span>{selectedAppName || 'Select service name'}</span>
            {isLoadingApps && (
              <div className='loader w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin'></div>
            )}
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
      </div>

      {/* Display report data */}
      {!selectedAppName && (
        <div className='mt-4 text-gray-500'>Select service name . . .</div>
      )}

      {selectedAppName && responseData.length === 0 && !isLoadingApps && (
        <div className='mt-8 text-gray-500 text-center'>
          No data available for selected service name
        </div>
      )}

      {responseData.length > 0 && (
        <div className='mt-4'>
          <table className='min-w-full table-auto'>
            <thead className='bg-gray-200'>
              <tr>
                <th className='px-4 py-2'>App Name</th>
                <th className='px-4 py-2'>Branch Name</th>
                <th className='px-4 py-2'>Build Name</th>
                <th className='px-4 py-2'>Generated At</th>
              </tr>
            </thead>
            <tbody>
              {responseData.map((build, index) => (
                <tr
                  key={build._id}
                  className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                >
                  <td className='px-4 py-2'>{build.appName}</td>
                  <td className='px-4 py-2'>{build.branchName}</td>
                  <td className='px-4 py-2'>{build.buildName}</td>
                  <td className='px-4 py-2'>{build.generated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BaselineApplicationTags;
