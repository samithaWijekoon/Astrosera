import React, { createContext, useContext, useState } from 'react';

const Ctx = createContext();
export function UserProvider({ children }) {
  const [email, setEmail] = useState(() => localStorage.getItem('userEmail') || '');
  const save = (e) => { setEmail(e); localStorage.setItem('userEmail', e); };
  return <Ctx.Provider value={{ email, setEmail: save }}>{children}</Ctx.Provider>;
}
export const useUser = () => useContext(Ctx);
