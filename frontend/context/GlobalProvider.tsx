import React, { createContext, useContext, useEffect, useState } from "react";
// import { getCurrentUser } from "../apis/userAPI";
import { getCsrfToken } from "@/apis/authAPI";

// interface GlobalContextProps {
//   isLogged: boolean;
//   setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
//   user: any;
//   setUser: React.Dispatch<React.SetStateAction<any>>;
//   loading: boolean;
//   csrfToken: string;
//   setCsrfToken: React.Dispatch<React.SetStateAction<string>>;
// }

const initialState: any = {
  isLogged: false,
  setIsLogged: () => {},
  user: null,
  setUser: () => {},
  loading: false,
  csrfToken: null,
  setCsrfToken: () => {},
};

const GlobalContext = createContext(initialState);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: any) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState(null);

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

  // useEffect(() => {
  //   getCsrfToken()
  //   .then((res: any) => {
  //     if (res) {
  //       setCsrfToken(res);
  //       console.log("set csrfToken: ", res);
  //     } else {
  //       console.log("no csrfToken");
  //     }
  //   })
  //   .catch((error: Error) => {
  //     console.log(error);
  //   });
  // }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        csrfToken,
        setCsrfToken,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;