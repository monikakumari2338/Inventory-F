import React from 'react';

import {createContext, useContext, useState} from 'react';
const LoggedStoreContext = createContext();
export const MyProvider = ({children}) => {
  const [value, setValue] = useState('');
  return (
    <LoggedStoreContext.Provider value={{value, setValue}}>
      {children}
    </LoggedStoreContext.Provider>
  );
};
export const storeContext = () => useContext(LoggedStoreContext);
