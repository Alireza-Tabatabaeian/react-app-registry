import fs from 'fs'
import path from 'path'
import { RegistryConfig } from './types'
import {configToContainer} from "./tools";

export const setupRegistry = <T = unknown>(
    configFile = 'react-app-registry.config.json'
) => {
    const configPath = path.resolve(process.cwd(), configFile)

    if (fs.existsSync(configPath)) {
        try {
            return configToContainer(JSON.parse(fs.readFileSync(configPath, 'utf-8')) as RegistryConfig<T>)
        } catch (e) {
            console.error('[react-app-registry] Failed to load config:', e)
        }
    }
}