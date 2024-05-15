import React, { createContext, useContext, useEffect, useState } from "react";
// import { getCurrentUser } from "../apis/userAPI";
// import { getCsrfToken } from "@/apis/authAPI";

// interface GlobalContextProps {
//   isLogged: boolean;
//   setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
//   user: any;
//   setUser: React.Dispatch<React.SetStateAction<any>>;
//   loading: boolean;
//   csrfToken: string;
//   setCsrfToken: React.Dispatch<React.SetStateAction<string>>;
// }

interface IUser {
  id: number;
  email: string;
  username: string;
  password: string;
  phone?: string;
}

const initialState: {
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
} = {
  isLogged: false,
  setIsLogged: () => {},
  user: null,
  setUser: () => {},
  loading: false,
};

const GlobalContext = createContext(initialState);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: any) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   getCurrentUser()
  //     .then((res: any) => {
  //       if (res) {
  //         setIsLogged(true);
  //         setUser(res);
  //       } else {
  //         setIsLogged(false);
  //         setUser(null);
  //       }
  //     })
  //     .catch((error: Error) => {
  //       console.log(error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, []);

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