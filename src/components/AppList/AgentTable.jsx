import PropTypes from 'prop-types';

const AgentTable = ({ agents, onBuildClick, onSortToggle, sortOrder }) => {
  return (
    <table className='table-auto w-full border-collapse border border-gray-300'>
      <thead>
        <tr className='bg-gray-100'>
          <th className='border border-gray-300 px-4 py-2'>Build ID</th>
          <th className='border border-gray-300 px-4 py-2'>Agent ID</th>
          <th
            className='border border-gray-300 px-4 py-2 cursor-pointer'
            onClick={onSortToggle}
          >
            Started{' '}
            {sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : ''}
          </th>
          <th className='border border-gray-300 px-4 py-2'>Lab ID</th>
        </tr>
      </thead>
      <tbody>
        {agents.map((agent, index) => (
          <tr key={index}>
            <td
              className='border border-gray-300 px-4 py-2 text-blue-500 cursor-pointer'
              onClick={() => onBuildClick(agent.bsid)}
            >
              {agent.buildName}
            </td>
            <td className='border border-gray-300 px-4 py-2'>
              {agent.agentId}
            </td>
            <td className='border border-gray-300 px-4 py-2'>
              {new Date(agent.started).toLocaleString()}
            </td>
            <td className='border border-gray-300 px-4 py-2'>{agent.labId}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

AgentTable.propTypes = {
  agents: PropTypes.arrayOf(
    PropTypes.shape({
      bsid: PropTypes.string.isRequired,
      buildName: PropTypes.string.isRequired,
      agentId: PropTypes.string.isRequired,
      started: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      labId: PropTypes.string.isRequired,
    })
  ).isRequired,
  onBuildClick: PropTypes.func.isRequired,
  onSortToggle: PropTypes.func.isRequired,
  sortOrder: PropTypes.oneOf(['asc', 'desc', '']).isRequired,
};

export default AgentTable;
