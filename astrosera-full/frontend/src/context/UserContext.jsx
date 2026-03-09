import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [email, setEmail] = useState(() => localStorage.getItem('astrosera_email') || '');

  function saveEmail(e) {
    setEmail(e);
    localStorage.setItem('astrosera_email', e);
  }

  return (
    <UserContext.Provider value={{ email, saveEmail }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() { return useContext(UserContext); }
