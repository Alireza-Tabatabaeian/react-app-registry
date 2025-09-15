'use client'

import React, { createContext, useContext, useMemo, useRef } from 'react'
import { RegistryContextInterface } from './types'
import {RegistryHandler} from "./RegistryHandler"

const RegistryContext = createContext<RegistryContextInterface | null>(null)

export const RegistryContextProvider: React.FC<{
    initial?: RegistryHandler<any> | undefined
    children: React.ReactNode
}> = ({ initial, children }) => {
    const handlerRef = useRef(initial ?? new RegistryHandler())

    // avoid re-creating closures on each render
    const api = useMemo<RegistryContextInterface>(() => {
        const handler = handlerRef.current
        return {
            register: handler.register,
            registerMany: handler.registerMany,
            loadByKey: handler.loadByKey,
            requireKey: handler.requireKey,
            getOne: handler.getOne,
            unregister: handler.unregister,
            clear: handler.clear,
            has: handler.has,
            keys: handler.keys,
        }
    }, [])

    return <RegistryContext.Provider value={api}>{children}</RegistryContext.Provider>
};

export const useRegistryContext = () => {
    const ctx = useContext(RegistryContext)
    if (!ctx) throw new Error('useRegistryContext must be used within a RegistryContextProvider')
    return ctx
}