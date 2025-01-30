import axios from 'axios';

const fetchAppNames = async (authToken) => {
  try {
    const response = await axios.get(
      'https://plutotv.sealights.co/sl-api/v1/apps',
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.data.apps.map((app) => app.appName);
  } catch (error) {
    console.error('Error fetching app names:', error);
    return [];
  }
};

export default fetchAppNames;
