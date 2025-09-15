export type RegistryContainer<T = unknown> = Map<string, T[]>

export class RegistryKeyNotFound extends Error {
    constructor(key: string) {
        super(`No registry items registered for key "${key}".`)
        this.name = "RegistryKeyNotFound"
    }
}

export interface RegistryContextInterface<T = unknown> {
    register: (key: string, item: T) => void
    registerMany: (key: string, items: T[]) => void
    loadByKey: (key: string) => T[] | undefined
    requireKey: (key: string) => T[]
    getOne: (key: string) => T | undefined
    unregister: (key: string, predicate?: (item: T, idx: number) => boolean) => void
    clear: (key?: string) => void
    has: (key: string) => boolean
    keys: () => string[]
}

export type RegistryConfig<T = unknown> = Record<string, T[]>