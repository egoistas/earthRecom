import { describe, expect, it, vi } from "vitest"
import { initialState, reducer, Modes } from "../domain/state"

describe("state reducer", () => {
  it("pickAB sets A then B then resets B and overwrites A", () => {
    const s0 = initialState()
    const s1 = reducer(s0, { type: "MAP_CLICK", llh: { lon: 1, lat: 2, h: 0 } })
    expect(s1.A).toMatchObject({ lon: 1, lat: 2, h: s0.defaultAlt })
    expect(s1.B).toBeNull()

    const s2 = reducer(s1, { type: "MAP_CLICK", llh: { lon: 3, lat: 4, h: 0 } })
    expect(s2.B).toMatchObject({ lon: 3, lat: 4, h: s0.defaultAlt })

    const s3 = reducer(s2, { type: "MAP_CLICK", llh: { lon: 9, lat: 9, h: 0 } })
    expect(s3.A).toMatchObject({ lon: 9, lat: 9, h: s0.defaultAlt })
    expect(s3.B).toBeNull()
  })

  it("addRisk adds a feature", () => {
    vi.stubGlobal("crypto", { randomUUID: () => "id1" })
    const s0 = initialState()
    const s1 = reducer({ ...s0, mode: Modes.ADD_RISK, featureAlt: 77 }, { type: "MAP_CLICK", llh: { lon: 1, lat: 2, h: 0 } })
    expect(s1.features).toHaveLength(1)
    expect(s1.features[0]).toMatchObject({ id: "id1", kind: "risk", lon: 1, lat: 2, h: 77 })
  })
})
