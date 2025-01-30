import axios from 'axios';

const fetchBuildDetails = async (bsid, token) => {
  try {
    const response = await axios.get(
      `https://plutotv.sealights.co/sl-api/v1/builds/${bsid}`,
      {
        headers: { Authorization: token },
      }
    );
    return response.data; // Return the build details
  } catch (error) {
    console.error('Error fetching build details:', error);
    throw error; // Rethrow error to handle it in the component
  }
};

export default fetchBuildDetails;
