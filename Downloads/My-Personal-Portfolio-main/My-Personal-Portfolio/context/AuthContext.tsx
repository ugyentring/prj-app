// context/AuthContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
    email: string
}

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<boolean>
    register: (email: string, password: string) => Promise<boolean>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        // Example: Check localStorage for logged in user
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
    }, [])

    const login = async (email: string, password: string) => {
        // Dummy auth - replace with your API call
        if (email && password) {
            const loggedInUser = { email }
            setUser(loggedInUser)
            localStorage.setItem('user', JSON.stringify(loggedInUser))
            return true
        }
        return false
    }

    const register = async (email: string, password: string) => {
        // Dummy register - replace with your API call
        if (email && password) {
            const newUser = { email }
            setUser(newUser)
            localStorage.setItem('user', JSON.stringify(newUser))
            return true
        }
        return false
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
