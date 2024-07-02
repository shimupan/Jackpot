import { createContext, useState, ReactNode, useEffect } from 'react';
import useCookies from '../hooks/useCookies';

type ProfileContext = {
   balance: number;
   setBalance: React.Dispatch<React.SetStateAction<number>>;
};

export const ProfileContext = createContext<ProfileContext | undefined>(undefined);

const ProfileContextProvider = ({ children }: { children: ReactNode }) => {
   const [userBalance] = useCookies('userToken', 1000) as [number];
   const [balance, setBalance] = useState(10000);

   useEffect(() => {
      if(userBalance) {
         setBalance(userBalance);
      }
   }, [userBalance]);

   return (
      <ProfileContext.Provider value={{ balance, setBalance }}>
         {children}
      </ProfileContext.Provider>
   );
};

export default ProfileContextProvider;