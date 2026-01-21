import { mkFeature } from "./feature"

export const Modes = {
  PICK_AB: "pickAB",
  ADD_RISK: "addRisk",
  ADD_NO_FLY: "addNoFly",
  ADD_BONUS: "addBonus"
}

export function initialState() {
  return {
    mode: Modes.PICK_AB,
    A: null,
    B: null,
    defaultAlt: 60,
    featureAlt: 60,
    features: []
  }
}

export function routePositionsLLH(A, B) {
  if (!A || !B) return null
  return [A, B]
}

export function applyMapClick(state, llh) {
  const { mode, A, B, defaultAlt, featureAlt } = state

  if (mode === Modes.PICK_AB) {
    const p = { ...llh, h: defaultAlt }
    if (!A) return { ...state, A: p }
    if (!B) return { ...state, B: p }
    return { ...state, A: p, B: null }
  }

  if (mode === Modes.ADD_RISK) {
    return { ...state, features: [...state.features, mkFeature("risk", llh, featureAlt)] }
  }

  if (mode === Modes.ADD_NO_FLY) {
    return { ...state, features: [...state.features, mkFeature("no_fly", llh, featureAlt)] }
  }

  if (mode === Modes.ADD_BONUS) {
    return { ...state, features: [...state.features, mkFeature("bonus", llh, featureAlt)] }
  }

  return state
}

export function reducer(state, action) {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.mode }
    case "SET_DEFAULT_ALT":
      return { ...state, defaultAlt: action.value }
    case "SET_FEATURE_ALT":
      return { ...state, featureAlt: action.value }
    case "CLEAR_AB":
      return { ...state, A: null, B: null }
    case "CLEAR_FEATURES":
      return { ...state, features: [] }
    case "RESET_ALL":
      return initialState()
    case "DELETE_FEATURE":
      return { ...state, features: state.features.filter((f) => f.id !== action.id) }
    case "MAP_CLICK":
      return applyMapClick(state, action.llh)
    default:
      return state
  }
}
