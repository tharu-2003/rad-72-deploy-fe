import React, { createContext, useContext, useEffect, useState } from 'react'
import { getMyDetails } from '../services/auth'

const AuthContext = createContext<any>(null)

export const AuthProvider = ({children} : any) => {
    const [user , setUser] = useState<any>(null)
    const [loading, setLoading] = useState<any>(true)

    useEffect(() => {
        // const fetchData = async () => {
        //     const data = await getMyDetails()

        //     if(data.data) {
        //         setUser(data.data)
        //     } else {
        //         setUser(null)
        //     }
        // }
        // fetchData()

        const token = localStorage.getItem("accessToken")

        if (token) {
            getMyDetails()
                .then((res) => {
                    if(res.data) setUser(res.data)
                    else setUser (null)
                })
                .catch ((error) => {
                    console.error(error)
                    setUser(null)
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            setUser(null)
            setLoading(false)
        }
    },[])

    return ( 
        <AuthContext.Provider value ={{user , setUser, loading}} >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext (AuthContext)
    if (!context) {
        throw new Error ("User must be used within an AuthProvider ...")
    }

    return context
}