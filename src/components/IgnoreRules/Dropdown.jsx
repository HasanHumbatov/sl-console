import PropTypes from 'prop-types';

const Dropdown = ({
  state,
  setState,
  searchInputRef,
  handleKeyDown,
  handleAppSelect,
}) => (
  <div className='relative mb-4 w-1/5'>
    <div className='flex items-center'>
      <button
        onClick={() =>
          setState((prevState) => ({
            ...prevState,
            isDropdownOpen: !prevState.isDropdownOpen,
          }))
        }
        className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-left w-full'
      >
        {state.selectedAppName || 'Select service name'}
        <span className='float-right'>
          {state.isDropdownOpen ? (
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
      {state.isLoading && (
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

    {state.isDropdownOpen && (
      <div className='absolute bg-white border rounded-lg shadow-lg w-full mt-2 z-10'>
        <input
          type='text'
          placeholder='Search...'
          value={state.searchTerm}
          onChange={(e) =>
            setState((prevState) => ({
              ...prevState,
              searchTerm: e.target.value,
            }))
          }
          className='w-full px-4 py-2 border-b focus:outline-none'
          onKeyDown={handleKeyDown}
          ref={searchInputRef}
        />
        <ul className='max-h-60 overflow-y-auto'>
          {state.filteredAppNames.map((appName, index) => (
            <li
              key={index}
              onClick={() => handleAppSelect(appName)}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                state.activeIndex === index ? 'bg-blue-100' : ''
              }`}
              onMouseEnter={() =>
                setState((prevState) => ({
                  ...prevState,
                  activeIndex: index,
                }))
              }
            >
              {appName}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

Dropdown.propTypes = {
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
  searchInputRef: PropTypes.object.isRequired,
  handleKeyDown: PropTypes.func.isRequired,
  handleAppSelect: PropTypes.func.isRequired,
};

export default Dropdown;
