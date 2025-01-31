// import { useState, useEffect, useRef, useCallback } from 'react';
// import config from '../config';
// import fetchAppNames from '../services/fetchAppNames';
// import fetchAgentsData from '../services/fetchAgentsData';
// import fetchBuildDetails from '../services/fetchBuildDetails';
// import DropdownButton from './AppList/DropdownButton';
// import Dropdown from './AppList/Dropdown';
// import AgentTable from './AppList/AgentTable';
// import Modal from './AppList/Modal';

// const AppList = () => {
//   const [state, setState] = useState({
//     appNames: [],
//     searchTerm: '',
//     filteredAppNames: [],
//     selectedAppName: '',
//     agentsData: [],
//     filteredAgents: [],
//     isDropdownOpen: false,
//     activeIndex: -1,
//     sortOrder: '',
//     modalData: null,
//     isModalOpen: false,
//     isLoading: false,
//   });

//   const dropdownRef = useRef(null);
//   const searchInputRef = useRef(null);

//   useEffect(() => {
//     const loadAppNames = async () => {
//       const apps = await fetchAppNames(config.AUTH_TOKEN);
//       setState((prevState) => ({
//         ...prevState,
//         appNames: apps,
//         filteredAppNames: apps,
//       }));
//     };
//     loadAppNames();
//   }, []);

//   useEffect(() => {
//     if (state.isDropdownOpen && searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   }, [state.isDropdownOpen]);

//   useEffect(() => {
//     setState((prevState) => ({
//       ...prevState,
//       filteredAppNames: prevState.appNames.filter((appName) =>
//         appName.toLowerCase().includes(prevState.searchTerm.toLowerCase())
//       ),
//     }));
//   }, [state.searchTerm, state.appNames]);

//   const handleKeyDown = useCallback(
//     (event) => {
//       if (!state.isDropdownOpen) return;

//       if (event.key === 'ArrowDown') {
//         setState((prevState) => ({
//           ...prevState,
//           activeIndex:
//             (prevState.activeIndex + 1) % prevState.filteredAppNames.length,
//         }));
//       } else if (event.key === 'ArrowUp') {
//         setState((prevState) => ({
//           ...prevState,
//           activeIndex:
//             (prevState.activeIndex - 1 + prevState.filteredAppNames.length) %
//             prevState.filteredAppNames.length,
//         }));
//       } else if (event.key === 'Enter' && state.activeIndex >= 0) {
//         handleAppSelect(state.filteredAppNames[state.activeIndex]);
//       }
//     },
//     [state.isDropdownOpen, state.activeIndex, state.filteredAppNames]
//   );

//   const handleAppSelect = async (appName) => {
//     setState((prevState) => ({
//       ...prevState,
//       selectedAppName: appName,
//       isDropdownOpen: false,
//       searchTerm: '',
//       activeIndex: -1,
//       isLoading: true,
//     }));

//     const agents = await fetchAgentsData(appName, config.AUTH_TOKEN);
//     setState((prevState) => ({
//       ...prevState,
//       filteredAgents: agents,
//       isLoading: false,
//     }));
//   };

//   const handleSortToggle = () => {
//     const newOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
//     setState((prevState) => ({
//       ...prevState,
//       sortOrder: newOrder,
//       filteredAgents: [...prevState.filteredAgents].sort((a, b) => {
//         const timeA = new Date(a.started).getTime();
//         const timeB = new Date(b.started).getTime();
//         return newOrder === 'asc' ? timeA - timeB : timeB - timeA;
//       }),
//     }));
//   };

//   const handleBuildClick = async (bsid) => {
//     const authToken = config.AUTH_TOKEN;
//     try {
//       const buildDetails = await fetchBuildDetails(bsid, authToken);

//       // Update the state with the fetched data
//       setState((prevState) => ({
//         ...prevState,
//         modalData: buildDetails,
//         isModalOpen: true,
//       }));
//     } catch (error) {
//       // Optional: handle errors specific to the component
//       console.error('Error handling build click:', error);
//     }
//   };

//   const closeModal = () => {
//     setState((prevState) => ({
//       ...prevState,
//       isModalOpen: false,
//       modalData: null,
//     }));
//   };

//   const handleClickOutside = useCallback((event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setState((prevState) => ({
//         ...prevState,
//         isDropdownOpen: false,
//       }));
//     }
//   }, []);

//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [handleClickOutside]);

//   return (
//     <div className='p-4'>
//       <h1 className='text-2xl font-bold mb-4'>Sealights Live Agents Info</h1>

//       <div className='relative mb-4 w-1/5' ref={dropdownRef}>
//         <DropdownButton
//           isOpen={state.isDropdownOpen}
//           onClick={() =>
//             setState((prevState) => ({
//               ...prevState,
//               isDropdownOpen: !prevState.isDropdownOpen,
//             }))
//           }
//           label={state.selectedAppName || 'Select service name'}
//           isLoading={state.isLoading}
//         />

//         <Dropdown
//           isOpen={state.isDropdownOpen}
//           filteredAppNames={state.filteredAppNames}
//           searchTerm={state.searchTerm}
//           onSearch={(e) =>
//             setState((prevState) => ({
//               ...prevState,
//               searchTerm: e.target.value,
//             }))
//           }
//           onKeyDown={handleKeyDown}
//           activeIndex={state.activeIndex}
//           onSelect={handleAppSelect}
//           onHover={(index) =>
//             setState((prevState) => ({ ...prevState, activeIndex: index }))
//           }
//           searchInputRef={searchInputRef}
//         />
//       </div>

//       {state.selectedAppName ? (
//         state.filteredAgents.length > 0 ? (
//           <AgentTable
//             agents={state.filteredAgents}
//             onBuildClick={handleBuildClick}
//             onSortToggle={handleSortToggle}
//             sortOrder={state.sortOrder}
//           />
//         ) : (
//           <p className='text-gray-500'>No data available for this service.</p>
//         )
//       ) : (
//         <p className='text-gray-500'>Select service name . . .</p>
//       )}

//       <Modal
//         isOpen={state.isModalOpen}
//         modalData={state.modalData || {}}
//         onClose={closeModal}
//       />
//     </div>
//   );
// };

// export default AppList;

import { useState, useEffect, useRef, useCallback } from 'react';
import config from '../config';
import fetchAppNames from '../services/fetchAppNames';
import fetchAgentsData from '../services/fetchAgentsData';
import fetchBuildDetails from '../services/fetchBuildDetails';
import DropdownButton from './AppList/DropdownButton';
import Dropdown from './AppList/Dropdown';
import AgentTable from './AppList/AgentTable';
import Modal from './AppList/Modal';

const AppList = () => {
  const [state, setState] = useState({
    appNames: [],
    searchTerm: '',
    filteredAppNames: [],
    selectedAppName: '',
    agentsData: [],
    filteredAgents: [],
    isDropdownOpen: false,
    activeIndex: -1,
    sortOrder: '',
    modalData: null,
    isModalOpen: false,
    isLoading: false,
  });

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const loadInitialData = async () => {
      setState((prevState) => ({ ...prevState, isLoading: true }));
      try {
        const [apps] = await Promise.all([fetchAppNames(config.AUTH_TOKEN)]);
        setState((prevState) => ({
          ...prevState,
          appNames: apps,
          filteredAppNames: apps,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Error loading initial data:', error);
        setState((prevState) => ({ ...prevState, isLoading: false }));
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (state.isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [state.isDropdownOpen]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      filteredAppNames: prevState.appNames.filter((appName) =>
        appName.toLowerCase().includes(prevState.searchTerm.toLowerCase())
      ),
    }));
  }, [state.searchTerm, state.appNames]);

  const handleKeyDown = useCallback(
    (event) => {
      if (!state.isDropdownOpen) return;

      if (event.key === 'ArrowDown') {
        setState((prevState) => ({
          ...prevState,
          activeIndex:
            (prevState.activeIndex + 1) % prevState.filteredAppNames.length,
        }));
      } else if (event.key === 'ArrowUp') {
        setState((prevState) => ({
          ...prevState,
          activeIndex:
            (prevState.activeIndex - 1 + prevState.filteredAppNames.length) %
            prevState.filteredAppNames.length,
        }));
      } else if (event.key === 'Enter' && state.activeIndex >= 0) {
        handleAppSelect(state.filteredAppNames[state.activeIndex]);
      }
    },
    [state.isDropdownOpen, state.activeIndex, state.filteredAppNames]
  );

  const handleAppSelect = async (appName) => {
    setState((prevState) => ({
      ...prevState,
      selectedAppName: appName,
      isDropdownOpen: false,
      searchTerm: '',
      activeIndex: -1,
      isLoading: true,
    }));

    try {
      const [agents] = await Promise.all([
        fetchAgentsData(appName, config.AUTH_TOKEN),
      ]);
      setState((prevState) => ({
        ...prevState,
        filteredAgents: agents,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error fetching agents data:', error);
      setState((prevState) => ({ ...prevState, isLoading: false }));
    }
  };

  const handleSortToggle = () => {
    const newOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
    setState((prevState) => ({
      ...prevState,
      sortOrder: newOrder,
      filteredAgents: [...prevState.filteredAgents].sort((a, b) => {
        const timeA = new Date(a.started).getTime();
        const timeB = new Date(b.started).getTime();
        return newOrder === 'asc' ? timeA - timeB : timeB - timeA;
      }),
    }));
  };

  const handleBuildClick = async (bsid) => {
    const authToken = config.AUTH_TOKEN;
    try {
      const [buildDetails] = await Promise.all([
        fetchBuildDetails(bsid, authToken),
      ]);

      // Update the state with the fetched data
      setState((prevState) => ({
        ...prevState,
        modalData: buildDetails,
        isModalOpen: true,
      }));
    } catch (error) {
      // Optional: handle errors specific to the component
      console.error('Error handling build click:', error);
    }
  };

  const closeModal = () => {
    setState((prevState) => ({
      ...prevState,
      isModalOpen: false,
      modalData: null,
    }));
  };

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setState((prevState) => ({
        ...prevState,
        isDropdownOpen: false,
      }));
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
      <h1 className='text-2xl font-bold mb-4'>Sealights Live Agents Info</h1>

      <div className='relative mb-4 w-1/5' ref={dropdownRef}>
        <DropdownButton
          isOpen={state.isDropdownOpen}
          onClick={() =>
            setState((prevState) => ({
              ...prevState,
              isDropdownOpen: !prevState.isDropdownOpen,
            }))
          }
          label={state.selectedAppName || 'Select service name'}
          isLoading={state.isLoading}
        />

        <Dropdown
          isOpen={state.isDropdownOpen}
          filteredAppNames={state.filteredAppNames}
          searchTerm={state.searchTerm}
          onSearch={(e) =>
            setState((prevState) => ({
              ...prevState,
              searchTerm: e.target.value,
            }))
          }
          onKeyDown={handleKeyDown}
          activeIndex={state.activeIndex}
          onSelect={handleAppSelect}
          onHover={(index) =>
            setState((prevState) => ({ ...prevState, activeIndex: index }))
          }
          searchInputRef={searchInputRef}
        />
      </div>

      {state.selectedAppName ? (
        state.filteredAgents.length > 0 ? (
          <AgentTable
            agents={state.filteredAgents}
            onBuildClick={handleBuildClick}
            onSortToggle={handleSortToggle}
            sortOrder={state.sortOrder}
          />
        ) : (
          <p className='text-gray-500'>No data available for this service.</p>
        )
      ) : (
        <p className='text-gray-500'>Select service name . . .</p>
      )}

      <Modal
        isOpen={state.isModalOpen}
        modalData={state.modalData || {}}
        onClose={closeModal}
      />
    </div>
  );
};

export default AppList;
