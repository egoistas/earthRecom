import { render, screen, fireEvent } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import App from "../app/App"

vi.mock("../cesium/CesiumGlobe", () => ({
  default: ({ onLeftClickLLH, onViewerReady }) => (
    <div>
      <button onClick={() => onViewerReady?.(null)}>viewer</button>
      <button onClick={() => onLeftClickLLH?.({ lon: 1, lat: 2, h: 0 })}>click</button>
    </div>
  )
}))

vi.mock("../cesium/useCesiumEntities", () => ({
  useCesiumEntities: () => {}
}))

describe("App UI", () => {
  it("adds A on map click", () => {
    render(<App />)
    fireEvent.click(screen.getByText("click"))
    expect(screen.getByText(/A:/)).toHaveTextContent("1.00000, 2.00000")
  })
})
