import axios from 'axios'
import {useState} from 'react';

export const api = axios.create({
  // baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
});

export const usePostHandler = (initialState = []) => {
    const [isLoading, setLoading] = useState(false);
    const [hasError, setError] = useState(false);
    const [data, setData] = useState(initialState);

    const handleRequest = (request, postData) => {
        setLoading(true);
        setError(false);

        return api.post(request, postData)
            .then(d => setData(d.data))
            .catch((d) => setError(d))
            .finally(() => setLoading(false))
    };

    return {isLoading, hasError, data, handleRequest};
};
