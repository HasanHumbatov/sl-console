import { useState, useEffect, useRef, useCallback } from 'react';
// import axios from 'axios';
import config from '../config';
import fetchAppNames from '../services/fetchAppNames';
import fetchAgentsData from '../services/fetchAgentsData';
import fetchBuildDetails from '../services/fetchBuildDetails';
import DropdownButton from './AppList/DropdownButton';
import Dropdown from './AppList/Dropdown';
import AgentTable from './AppList/AgentTable';
import Modal from './AppList/Modal';

// const fetchAppNames = async () => {
//   try {
//     const response = await axios.get(
//       'https://plutotv.sealights.co/sl-api/v1/apps',
//       {
//         headers: { Authorization: config.AUTH_TOKEN },
//       }
//     );
//     return response.data.data.apps.map((app) => app.appName);
//   } catch (error) {
//     console.error('Error fetching app names:', error);
//     return [];
//   }
// };

// const fetchAgentsData = async (appName) => {
//   try {
//     const response = await axios.get(
//       'https://plutotv.sealights.co/sl-api/v1/agents/live',
//       {
//         headers: { Authorization: config.AUTH_TOKEN },
//       }
//     );
//     return response.data.data.filter((agent) => agent.appName === appName);
//   } catch (error) {
//     console.error('Error fetching agents data:', error);
//     return [];
//   }
// };

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
    sortOrder: null,
    modalData: null,
    isModalOpen: false,
    isLoading: false,
  });

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const loadAppNames = async () => {
      const apps = await fetchAppNames(config.AUTH_TOKEN);
      setState((prevState) => ({
        ...prevState,
        appNames: apps,
        filteredAppNames: apps,
      }));
    };
    loadAppNames();
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

    const agents = await fetchAgentsData(appName, config.AUTH_TOKEN);
    setState((prevState) => ({
      ...prevState,
      filteredAgents: agents,
      isLoading: false,
    }));
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

  // const handleBuildClick = async (bsid) => {
  //   try {
  //     const response = await axios.get(
  //       `https://plutotv.sealights.co/sl-api/v1/builds/${bsid}`,
  //       {
  //         headers: { Authorization: config.AUTH_TOKEN },
  //       }
  //     );
  //     setState((prevState) => ({
  //       ...prevState,
  //       modalData: response.data,
  //       isModalOpen: true,
  //     }));
  //   } catch (error) {
  //     console.error('Error fetching build details:', error);
  //   }
  // };

  const handleBuildClick = async (bsid) => {
    const authToken = config.AUTH_TOKEN;
    try {
      const buildDetails = await fetchBuildDetails(bsid, authToken);

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

  // return (
  //   <div className='p-4'>
  //     <h1 className='text-2xl font-bold mb-4'>Sealights Live Agents Info</h1>

  //     <div className='relative mb-4 w-1/5' ref={dropdownRef}>
  //       <div className='flex items-center'>
  //         <button
  //           onClick={() =>
  //             setState((prevState) => ({
  //               ...prevState,
  //               isDropdownOpen: !prevState.isDropdownOpen,
  //             }))
  //           }
  //           className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-left w-full'
  //         >
  //           {state.selectedAppName || 'Select service name'}
  //           <span className='float-right'>
  //             {state.isDropdownOpen ? (
  //               <svg
  //                 xmlns='http://www.w3.org/2000/svg'
  //                 className='h-5 w-5 inline-block'
  //                 viewBox='0 0 20 20'
  //                 fill='currentColor'
  //               >
  //                 <path
  //                   fillRule='evenodd'
  //                   d='M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
  //                   clipRule='evenodd'
  //                 />
  //               </svg>
  //             ) : (
  //               <svg
  //                 xmlns='http://www.w3.org/2000/svg'
  //                 className='h-5 w-5 inline-block'
  //                 viewBox='0 0 20 20'
  //                 fill='currentColor'
  //               >
  //                 <path
  //                   fillRule='evenodd'
  //                   d='M14.707 10.707a1 1 0 01-1.414 0L10 7.414 6.707 10.707a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z'
  //                   clipRule='evenodd'
  //                 />
  //               </svg>
  //             )}
  //           </span>
  //         </button>
  //         {state.isLoading && (
  //           <svg
  //             className='animate-spin h-5 w-5 text-blue-500 ml-2'
  //             xmlns='http://www.w3.org/2000/svg'
  //             fill='none'
  //             viewBox='0 0 24 24'
  //           >
  //             <circle
  //               className='opacity-25'
  //               cx='12'
  //               cy='12'
  //               r='10'
  //               stroke='currentColor'
  //               strokeWidth='4'
  //             ></circle>
  //             <path
  //               className='opacity-75'
  //               fill='currentColor'
  //               d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
  //             ></path>
  //           </svg>
  //         )}
  //       </div>

  //       {state.isDropdownOpen && (
  //         <div className='absolute bg-white border rounded-lg shadow-lg w-full mt-2 z-10'>
  //           <input
  //             type='text'
  //             placeholder='Search...'
  //             value={state.searchTerm}
  //             onChange={(e) =>
  //               setState((prevState) => ({
  //                 ...prevState,
  //                 searchTerm: e.target.value,
  //               }))
  //             }
  //             className='w-full px-4 py-2 border-b focus:outline-none'
  //             onKeyDown={handleKeyDown}
  //             ref={searchInputRef}
  //           />
  //           <ul className='max-h-60 overflow-y-auto'>
  //             {state.filteredAppNames.map((appName, index) => (
  //               <li
  //                 key={index}
  //                 onClick={() => handleAppSelect(appName)}
  //                 className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
  //                   state.activeIndex === index ? 'bg-blue-100' : ''
  //                 }`}
  //                 onMouseEnter={() =>
  //                   setState((prevState) => ({
  //                     ...prevState,
  //                     activeIndex: index,
  //                   }))
  //                 }
  //               >
  //                 {appName}
  //               </li>
  //             ))}
  //           </ul>
  //         </div>
  //       )}
  //     </div>

  //     {state.selectedAppName ? (
  //       state.filteredAgents.length > 0 ? (
  //         <table className='table-auto w-full border-collapse border border-gray-300'>
  //           <thead>
  //             <tr className='bg-gray-100'>
  //               <th className='border border-gray-300 px-4 py-2'>Build ID</th>
  //               <th className='border border-gray-300 px-4 py-2'>Agent ID</th>
  //               <th
  //                 className='border border-gray-300 px-4 py-2 cursor-pointer'
  //                 onClick={handleSortToggle}
  //               >
  //                 Started{' '}
  //                 {state.sortOrder === 'asc'
  //                   ? '↑'
  //                   : state.sortOrder === 'desc'
  //                   ? '↓'
  //                   : ''}
  //               </th>
  //               <th className='border border-gray-300 px-4 py-2'>Lab ID</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {state.filteredAgents.map((agent, index) => (
  //               <tr key={index}>
  //                 <td
  //                   className='border border-gray-300 px-4 py-2 text-blue-500 cursor-pointer'
  //                   onClick={() => handleBuildClick(agent.bsid)}
  //                 >
  //                   {agent.buildName}
  //                 </td>
  //                 <td className='border border-gray-300 px-4 py-2'>
  //                   {agent.agentId}
  //                 </td>
  //                 <td className='border border-gray-300 px-4 py-2'>
  //                   {new Date(agent.started).toLocaleString()}
  //                 </td>
  //                 <td className='border border-gray-300 px-4 py-2'>
  //                   {agent.labId}
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       ) : (
  //         <p className='text-gray-500'>No data available for this service.</p>
  //       )
  //     ) : (
  //       <p className='text-gray-500'>Select service name . . .</p>
  //     )}

  //     {state.isModalOpen && state.modalData && (
  //       <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-20'>
  //         <div className='bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full'>
  //           <h2 className='text-2xl font-bold mb-4'>Build Details</h2>
  //           <pre className='bg-gray-100 p-4 rounded'>
  //             {JSON.stringify(state.modalData, null, 2)}
  //           </pre>
  //           <button
  //             className='mt-4 bg-red-500 text-white px-4 py-2 rounded'
  //             onClick={closeModal}
  //           >
  //             Close
  //           </button>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
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
        modalData={state.modalData}
        onClose={closeModal}
      />
    </div>
  );
};

export default AppList;
