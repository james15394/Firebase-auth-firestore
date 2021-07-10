import React, { createContext, useEffect, useState } from "react";
import firebase from "firebase/app";
import { useContext } from "react";
import { auth } from "../../firebase";

const UserContext = createContext<firebase.User | null>(null);

export function useUser() {
  return useContext(UserContext);
}

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged((data) => {
      console.log(data);
      setUser(data);
      setLoading(false);
    });
    return unsubcribe;
  }, []);
  if (loading) {
    return <div>...Loading</div>;
  }
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
