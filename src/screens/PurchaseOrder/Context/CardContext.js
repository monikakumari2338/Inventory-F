import React from 'react';

import {createContext, useContext, useState} from 'react';
const CardContext = createContext();
export const MyCardContextProvider = ({children}) => {
  const [cardData, setCardData] = useState([]);
  return (
    <CardContext.Provider value={{cardData, setCardData}}>
      {children}
    </CardContext.Provider>
  );
};
export const useCardContext = () => useContext(CardContext);
