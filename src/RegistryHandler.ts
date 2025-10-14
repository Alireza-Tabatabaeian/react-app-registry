import {RegistryContainer, RegistryKeyNotFound} from "./types";

export class RegistryHandler<T = unknown> {
    container: RegistryContainer<T>

    constructor(container?: RegistryContainer<T>) {
        this.container = container ?? new Map<string, T[]>()
    }

    register = (key: string, item: T) => {
        if (!this.container.has(key)) {
            const items: T[] = this.container.get(key) ?? []
            if (items.includes(item))
                return // prevent duplicate ite
            items.push(item)
            this.container.set(key, items)
        } else {
            this.container.set(key, [item])
        }
    }

    registerMany = (key: string, items: T[]): void => {
        const arr = this.container.get(key) ?? []
        arr.push(...items)
        this.container.set(key, arr)
    }

    loadByKey = (key: string): T[] | undefined => this.container.get(key)

    requireKey = (key: string): T[] => {
        const items = this.container.get(key)
        if (!items) throw new RegistryKeyNotFound(key)
        return items
    }

    getOne = (key: string): T | undefined => {
        const items = this.container.get(key)
        return items?.[0]
    }

    /** Remove items by predicate; remove the key if it becomes empty. */
    unregister = (
        key: string,
        predicate?: (item: T, idx: number) => boolean
    ): void => {
        const items = this.container.get(key)
        if (!items) return
        if (!predicate) {
            this.container.delete(key)
            return
        }
        const next = items.filter((x, i) => !predicate(x, i))
        if (next.length)
            this.container.set(key, next)
        else
            this.container.delete(key)
    }

    /** Clear everything or a single bucket. */
    clear = (key?: string): void => {
        if (key === undefined)
            this.container.clear()
        else
            this.container.delete(key)
    }

    /** Introspection helpers */
    has = (key: string): boolean => this.container.has(key)
    keys = (): string[] => Array.from(this.container.keys())
    size = (): number => this.container.size
}