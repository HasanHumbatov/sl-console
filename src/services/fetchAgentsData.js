import axios from 'axios';

const fetchAgentsData = async (appName, token) => {
  try {
    const response = await axios.get(
      'https://plutotv.sealights.co/sl-api/v1/agents/live',
      {
        headers: { Authorization: token },
      }
    );
    return response.data.data.filter((agent) => agent.appName === appName);
  } catch (error) {
    console.error('Error fetching agents data:', error);
    return [];
  }
};

export default fetchAgentsData;
