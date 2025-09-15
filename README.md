# react-app-registry

Tiny registry/context to dynamically register and resolve React components (and other items) by key.

- Register multiple items per key (e.g., multiple blocks for a region)
- Resolve all or just the first item
- Works great for plugin systems, CMS-like blocks, feature renderers

## Install

```bash
npm i react-app-registry
# or
yarn add react-app-registry
```

Peer deps: `react` and `react-dom` (v18+).

## Quick start

```tsx
'use client'

import React from 'react'
import { RegistryContextProvider, useRegistryContext } from 'react-app-registry'

const Page: React.FC = () => <div>My Page</div>

function Registrar() {
  const { register, getOne } = useRegistryContext()
  React.useEffect(() => {
    register('myFavoriteRenderers', Page)
  }, [register])

  const Comp = getOne('myFavoriteRenderers') as React.FC | undefined
  return <>{Comp ? <Comp /> : null}</>
}

export default function App() {
  return (
    <RegistryContextProvider>
      <Registrar />
    </RegistryContextProvider>
  )
}
```

## API

- `register(key, item)` — push one item
- `registerMany(key, items[])`
- `loadByKey(key)` → `T[] | undefined`
- `requireKey(key)` → `T[]` (throws if missing)
- `getOne(key)` → `T | undefined`
- `unregister(key, predicate?)`
- `clear(key?)`
- `has(key)` / `keys()`

## Server config loader (optional)

If you want to seed the registry from a JSON file at **build/server time**:

```ts
// react-app-registry.config.json
{
  "myFavoriteRenderers": [
    /* importable component references are not JSON-serializable.
       Typically you'll use this to seed non-component data or
       build a handler with file-based registration in Node. */
  ]
}
```

```tsx
// server usage (Next.js Route Handler / Server Component / build-time)
import { RegistryContextProvider } from 'react-app-registry'
import { setupRegistry } from 'react-app-registry/server' // or same import if you export it from root
import { ReactNode } from 'react'

export default function Root({ children }: { children: ReactNode }) {
  const handler = setupRegistry(); // Node-only
  return <RegistryContextProvider initial={handler}>{children}</RegistryContextProvider>
}
```

> **Note:** `setupRegistry` uses Node’s `fs`/`path`. Don’t call it in the browser.

## TypeScript

All APIs are generic:

```tsx
type Renderer = React.FC<{ title: string }>
const handler = new RegistryHandler<Renderer>()
handler.register('card', (p) => <h2>{p.title}</h2>)

// with the hook:
const { register, getOne } = useRegistryContext<Renderer>()
```

## Why?

- Decouple “who renders” from “who decides what to render”
- Create block/slot systems without prop-drilling
- Enable plugin ecosystems (feature flags, A/B tests, themepacks)

## License

MIT © [Alireza Tabatabaeian](https://github.com/Alireza-Tabatabaeian)
