import React from "react";
import { createContext } from "react";
import { useState } from "react";

export let userContext = createContext();

export default function UserContextProvider({ children }) {
  let [token, setToken] = useState(localStorage.getItem("token") || "");
  let [user, setUser] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {});
  return (
    <userContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </userContext.Provider>
  );
}
