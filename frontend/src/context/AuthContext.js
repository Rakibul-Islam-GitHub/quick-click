import React from 'react'
import { createContext, useState } from 'react'
import { getAuth, getUserState } from './helper'



const initialValue = {
    authenticated: getAuth(),
    user: getUserState() ,
    setUser: ()=>{},
  setAuthenticated: () => {}
}

const AuthContext = createContext(initialValue)

const AuthProvider = ({ children }) => {
    
 
  const [ authenticated, setAuthenticated ] = useState(initialValue.authenticated)
  const [ user, setUser ] = useState(initialValue.user)


  return (
    <AuthContext.Provider value={{authenticated, setAuthenticated, user, setUser}}>
      {children}
    </AuthContext.Provider>
  )
}

export {  AuthContext, AuthProvider }