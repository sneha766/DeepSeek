"use client"

import { createContext } from "react"
import { useContext } from "react";
import { useUser } from "@clerk/nextjs";


export const AppContext = createContext();

export const useAppContext = ()=>{
    return useContext(AppContext)
}

export const AppcontextProvider = ({children})=>{
    const {user} = useUser()
    const value = {
        user
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}