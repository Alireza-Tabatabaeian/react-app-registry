import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'

// Adjust this import to match your project layout:
// If you re-export from src/index.ts, use: `import { setupRegistry, RegistryHandler } from '../src'`
// If you keep files separate, use the specific module paths:
import { setupRegistry } from '../src'
import { RegistryHandler } from '../src'

describe('setupRegistry (Node-only)', () => {
  let tmpDir: string
  const cfgName = 'react-app-registry.config.json'

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'registry-'))
    // Redirect process.cwd() to the temp dir for this test
    vi.spyOn(process, 'cwd').mockReturnValue(tmpDir as unknown as string)
  })

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    } catch {}
    vi.restoreAllMocks()
  })

  it('returns an empty handler when no config file exists', () => {
    const handler = setupRegistry<string>(cfgName)
    expect(handler).toBeInstanceOf(RegistryHandler)
    expect(handler.size()).toBe(0)
  })

  it('loads entries from JSON config into a RegistryHandler', () => {
    const cfgPath = path.join(tmpDir, cfgName)
    const cfg = {
      greetings: ['hello', 'bonjour'],
      numbers: [1, 2, 3] // will be coerced to any[] in real app you likely store non-component data
    }
    fs.writeFileSync(cfgPath, JSON.stringify(cfg), 'utf-8')

    const handler = setupRegistry<any>(cfgName)

    expect(handler).toBeInstanceOf(RegistryHandler)
    expect(handler.keys().sort()).toEqual(['greetings', 'numbers'])
    expect(handler.requireKey('greetings')).toEqual(['hello', 'bonjour'])
    expect(handler.requireKey('numbers')).toEqual([1, 2, 3])
  })

  it('merges with programmatic registrations if desired', () => {
    const cfgPath = path.join(tmpDir, cfgName)
    fs.writeFileSync(cfgPath, JSON.stringify({ a: ['x'] }), 'utf-8')

    // Load from file
    const handler = setupRegistry<string>(cfgName)
    // Programmatically add more
    handler.registerMany('a', ['y', 'z'])
    handler.register('b', 'b1')

    expect(handler.requireKey('a')).toEqual(['x', 'y', 'z'])
    expect(handler.requireKey('b')).toEqual(['b1'])
    expect(handler.size()).toBe(2)
  })

  it('is resilient to malformed JSON (logs but returns an empty handler)', () => {
    const cfgPath = path.join(tmpDir, cfgName)
    fs.writeFileSync(cfgPath, '{ not-json: true }', 'utf-8')
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const handler = setupRegistry<string>(cfgName)

    expect(handler).toBeInstanceOf(RegistryHandler)
    expect(handler.size()).toBe(0)
    expect(spy).toHaveBeenCalled()

    spy.mockRestore()
  })
})
