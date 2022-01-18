import { useState, useCallback, useEffect } from 'react';

const storageName = 'userData';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [userId, setUserID] = useState(null);

  console.log(token);

  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken);
    setUserID(id);

    localStorage.setItem(storageName, JSON.stringify({ userId: id, token: jwtToken }));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserID(null);

    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    console.log('uf-', token, '\ndata', data);
    if (data && data.token) {
      login(data.token, data.userId);
    }

    setReady(true);
  }, []);

  return { login, logout, token, userId, ready };
};
