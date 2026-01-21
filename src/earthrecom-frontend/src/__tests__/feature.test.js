import { describe, expect, it, vi } from "vitest"
import { mkFeature } from "../domain/feature"

describe("mkFeature", () => {
  it("creates feature with override altitude", () => {
    vi.stubGlobal("crypto", { randomUUID: () => "x" })
    const f = mkFeature("no_fly", { lon: 1, lat: 2, h: 10 }, 50)
    expect(f).toMatchObject({ id: "x", kind: "no_fly", lon: 1, lat: 2, h: 50 })
  })
})
