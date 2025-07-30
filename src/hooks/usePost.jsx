import { useState } from 'react';
import axios from 'axios';

const usePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const postData = async (url, payload, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(url, payload, config);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error, data };
};

export default usePost;
