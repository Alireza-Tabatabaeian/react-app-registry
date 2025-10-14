import {RegistryConfig, RegistryContainer} from "./types";

export const configToContainer = <T = unknown>(config: RegistryConfig<T>): RegistryContainer => {
    const container = new Map<string, T[]>
    for (const key in config) {
        const items = config[key]
        const arr = container.get(key) ?? []
        arr.push(...items)
        container.set(key, arr)
    }
    return container
}