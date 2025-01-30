import axios from 'axios';

const fetchIgnoreRules = async (selectedAppName, authToken) => {
  try {
    const response = await axios.get(
      `https://plutotv.sealights.co/sl-api/v1/settings/apps/${selectedAppName}/ignore-rules`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data.data.records;
  } catch (error) {
    console.error('Error fetching ignore rules:', error);
    return [];
  }
};

export default fetchIgnoreRules;
