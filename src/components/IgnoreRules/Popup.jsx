import PropTypes from 'prop-types';

const Popup = ({ state, popupRef, closePopup }) =>
  state.popup.visible && (
    <div
      className='absolute bg-white border rounded-lg shadow-lg p-2'
      style={{ top: state.popup.y, left: state.popup.x }}
      ref={popupRef}
      onClick={closePopup}
    >
      {state.popup.email}
    </div>
  );

Popup.propTypes = {
  state: PropTypes.object.isRequired,
  popupRef: PropTypes.object.isRequired,
  closePopup: PropTypes.func.isRequired,
};

export default Popup;
