import axios from "axios";
import {createContext, useEffect, useState } from "react";
import defaultPic from "../upload/default-pic.jpg";

export const AuthContext = createContext();


export const AuthContextProvider = ({ children }) => {
  // children refers to the nested components enclosed within <BrowserRouter>
  const [currentUser, setCurrentUser] = useState(
    // Check if there is a user
    JSON.parse(sessionStorage.getItem('user')) || null
  );

  const login = async (input) => {
    const res = await axios.post('https://virtual-vanguard-mmo-f84f119b0dd9.herokuapp.com/auth/login', input, {
      withCredentials: true,
      sameSite: "none"
    });
    setCurrentUser(res.data);
  }

  const register = async (input) => {
    const setDefaultPic = {
      ...input,
      profilePic: defaultPic
    };

    const res = await axios.post('https://virtual-vanguard-mmo-f84f119b0dd9.herokuapp.com/auth/register', input, setDefaultPic);
    setCurrentUser(res.data);
  }
  
  useEffect(() => {
    // Write user object into session storage
    sessionStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser]);
  
  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login, register }}>
      {/* children allows the nested components to access the shared data provided by the context api */}
      {children}
    </AuthContext.Provider>
  )
}