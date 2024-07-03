import { useCallback, useState, useMemo } from 'react';
import Cookies from 'universal-cookie';

export default function useCookie<T>(name: string, defaultValue: T) {
   const cookies = useMemo(() => new Cookies(), []);
   
   const [value, setValue] = useState<T | null>(() => {
      const cookie = cookies.get(name);
      if (cookie) return cookie;
      cookies.set(name, defaultValue, { path: '/' });
      return defaultValue;
   });

   const updateCookie = useCallback(
      (newValue: T) => {
         cookies.set(name, newValue, { path: '/' });
         setValue(newValue);
      },
      [name, cookies],
   );

   const deleteCookie = useCallback(() => {
      cookies.remove(name, {path: '/'});
      setValue(null); 
   }, [name, cookies]);

   return [value, updateCookie, deleteCookie];
}