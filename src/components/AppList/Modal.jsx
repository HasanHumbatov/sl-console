import PropTypes from 'prop-types';

const Modal = ({ isOpen, modalData, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-20'>
      <div className='bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full'>
        <h2 className='text-2xl font-bold mb-4'>Build Details</h2>
        <pre className='bg-gray-100 p-4 rounded'>
          {JSON.stringify(modalData, null, 2)}
        </pre>
        <button
          className='mt-4 bg-red-500 text-white px-4 py-2 rounded'
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  modalData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
