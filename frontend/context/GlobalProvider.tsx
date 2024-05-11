import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../apis/userAPI";

interface GlobalContextProps {
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
}

const initialState: GlobalContextProps = {
  isLogged: false,
  setIsLogged: () => {},
  user: null,
  setUser: () => {},
  loading: true,
};

const GlobalContext = createContext(initialState);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res: any) => {
        if (res) {
          setIsLogged(true);
          setUser(res);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      })
      .catch((error: Error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;