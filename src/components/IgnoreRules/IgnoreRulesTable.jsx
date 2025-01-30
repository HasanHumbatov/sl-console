import PropTypes from 'prop-types';

const IgnoreRulesTable = ({ rules, handleNameClick }) => (
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
      {rules.map((rule, index) => (
        <tr key={rule.ruleId}>
          <td className='border border-gray-300 px-4 py-2'>{index + 1}</td>
          <td className='border border-gray-300 px-4 py-2'>{rule.scope}</td>
          <td className='border border-gray-300 px-4 py-2'>{rule.path}</td>
          <td className='border border-gray-300 px-4 py-2'>
            <span
              className='underline cursor-pointer text-blue-600 popup-trigger'
              onClick={(event) => handleNameClick(rule.createdBy.email, event)}
            >
              {rule.createdBy.firstName} {rule.createdBy.lastName}
            </span>
          </td>
          <td className='border border-gray-300 px-4 py-2'>
            {rule.condition || 'N/A'}
          </td>
          <td className='border border-gray-300 px-4 py-2'>{rule.reason}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

IgnoreRulesTable.propTypes = {
  rules: PropTypes.array.isRequired,
  handleNameClick: PropTypes.func.isRequired,
};

export default IgnoreRulesTable;
