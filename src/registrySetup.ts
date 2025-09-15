import fs from 'fs'
import path from 'path'
import { RegistryConfig } from './types'
import {RegistryHandler} from "./RegistryHandler"

export const setupRegistry = <T = unknown>(
    configFile = 'react-app-registry.config.json'
) => {
    const configPath = path.resolve(process.cwd(), configFile)
    const handler = new RegistryHandler<T>()

    if (fs.existsSync(configPath)) {
        try {
            const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as RegistryConfig<T>
            for (const [key, items] of Object.entries(userConfig)) {
                handler.registerMany(key, items)
            }
        } catch (e) {
            console.error('[react-app-registry] Failed to load config:', e)
        }
    }
    return handler
}