import PropTypes from 'prop-types';

const Dropdown = ({
  isOpen,
  filteredAppNames,
  searchTerm,
  onSearch,
  onKeyDown,
  activeIndex,
  onSelect,
  onHover,
  searchInputRef,
}) => {
  return (
    isOpen && (
      <div className='absolute bg-white border rounded-lg shadow-lg w-full mt-2 z-10'>
        <input
          type='text'
          placeholder='Search...'
          value={searchTerm}
          onChange={onSearch}
          className='w-full px-4 py-2 border-b focus:outline-none'
          onKeyDown={onKeyDown}
          ref={searchInputRef}
        />
        <ul className='max-h-60 overflow-y-auto'>
          {filteredAppNames.map((appName, index) => (
            <li
              key={index}
              onClick={() => onSelect(appName)}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                activeIndex === index ? 'bg-blue-100' : ''
              }`}
              onMouseEnter={() => onHover(index)}
            >
              {appName}
            </li>
          ))}
        </ul>
      </div>
    )
  );
};

Dropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  filteredAppNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  activeIndex: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired,
  searchInputRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    .isRequired,
};

export default Dropdown;
