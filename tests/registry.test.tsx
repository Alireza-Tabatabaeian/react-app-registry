import { describe, it, expect } from "vitest"
import React from "react";
import { renderHook, act } from "@testing-library/react"
import {
    RegistryContextProvider, RegistryHandler,
    useRegistryContext,
} from "../dist"

describe("RegistryHandler", () => {
    it("registers and retrieves items", () => {
        const handler = new RegistryHandler<string>()
        handler.register("foo", "bar")

        expect(handler.getOne("foo")).toEqual("bar")
        expect(handler.requireKey("foo")).toEqual(["bar"])
        expect(handler.getOne("foo")).toBe("bar")
    })

    it("registers multiple items", () => {
        const handler = new RegistryHandler<number>()
        handler.registerMany("nums", [1, 2, 3])

        expect(handler.requireKey("nums")).toEqual([1, 2, 3])
    })

    it("unregisters items selectively", () => {
        const handler = new RegistryHandler<number>()
        handler.registerMany("nums", [1, 2, 3, 4])

        handler.unregister("nums", (x) => x % 2 === 0)
        expect(handler.requireKey("nums")).toEqual([1, 3])
    })

    it("clears keys", () => {
        const handler = new RegistryHandler<string>()
        handler.register("a", "alpha")
        handler.register("b", "beta")

        handler.clear("a")
        expect(handler.getOne("a")).toBeUndefined()
        expect(handler.getOne("b")).toEqual("beta")

        handler.clear()
        expect(handler.size()).toBe(0)
    })
})

describe("RegistryContext", () => {
    it("registers and retrieves items via hook", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <RegistryContextProvider>{children}</RegistryContextProvider>
        )

        const { result } = renderHook(() => useRegistryContext(), {
            wrapper,
        })

        act(() => {
            result.current.register("foo", "bar")
        })

        expect(result.current.getOne("foo")).toBe("bar")
    })
})