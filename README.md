# Cesium Interaction & Feature Workflow

This project implements a **clean, scalable interaction workflow** for geospatial features on a Cesium globe using **React** and a **reducer-based state architecture**.

The core design principle is strict separation between:

- interaction logic  
- state transitions  
- Cesium rendering  

---

## High-Level Architecture

The application follows a **unidirectional data flow**:

```
UI → Action → Reducer → State → Cesium Render
```

**Key rules**

- Cesium never mutates state  
- Reducers never reference Cesium  
- All map interactions pass through a single entry point  

This makes the system predictable, debuggable, and easy to extend.

---

## Interaction Modes

All user interactions are contextual and driven by a `mode`.

Defined in `domain/state.js`:

- **PICK_AB** – select points A and B  
- **ADD_RISK** – add a risk feature  
- **ADD_NO_FLY** – add a no-fly feature  
- **ADD_BONUS** – add a bonus feature  
- **DRAW_FIELD** – draw a closed polygon (e.g. agricultural field)  

The active mode is changed **only** via:

```js
dispatch({ type: "SET_MODE", mode })
```

---

## Map Click Handling (Single Entry Point)

All Cesium clicks are handled in exactly **one place**.

### CesiumGlobe

- Converts screen clicks to Cartesian coordinates  
- Converts Cartesian → LLH  
- Emits a single callback:

```js
onLeftClickLLH(llh)
```

### App Layer

The application does **not** interpret clicks directly.  
It simply dispatches:

```js
dispatch({ type: "MAP_CLICK", llh })
```

---

## State Transition Logic

All domain logic lives in the reducer.

### `applyMapClick(state, llh)`

Behavior depends entirely on the current `mode`:

- **PICK_AB** → sets A and B  
- **ADD_RISK / ADD_NO_FLY / ADD_BONUS** → creates a feature via `mkFeature`  
- **DRAW_FIELD** → appends a point to `fieldLLH`  

The reducer:

- is pure  
- has no side effects  
- has no knowledge of Cesium  

---

## Cesium Rendering Layer

Cesium is treated as a **pure rendering engine**.

### `useCesiumEntities`

This hook receives slices of state:

- `A`, `B`  
- `routeLLH`  
- `features`  
- `fieldLLH`  

For each feature type:

- a dedicated `useEffect`  
- a persistent `useRef` for Cesium entities  
- create / update / remove logic only  

Cesium entities are **derived from state**, never the other way around.

---

## UI Components

UI components (`ControlPanel`, `Status`, `FeatureList`):

- have no Cesium knowledge  
- have no geospatial logic  
- emit intent via callbacks only  

Example callbacks:

```js
onMode(...)
onUndoFieldPoint()
onClearField()
```

The `App` component translates UI intent into reducer actions.

---

## Adding a New Feature (Standard Workflow)

To add a new interactive feature, always follow these steps:

1. **Add a Mode**  
   Extend `Modes` in `state.js`

2. **Handle State**  
   Add logic to `applyMapClick` and/or reducer cases

3. **Expose UI Controls**  
   Add buttons or inputs in `ControlPanel`

4. **Render in Cesium**  
   Add a new `useEffect` and entity ref in `useCesiumEntities`

**Rules**

- Reducers never reference Cesium  
- Cesium never mutates state  
- All interactions go through `MAP_CLICK`  

---

## Field / Polygon Drawing

Field drawing is implemented as:

- click-to-collect LLH points  
- stored in `fieldLLH`  
- rendered as a closed polyline or polygon  
- requires at least **3 points**  

Undo and clear operations are reducer-based and deterministic.

---

## Design Rationale

This architecture provides:

- predictable debugging (state → render)  
- easy feature extension  
- safe refactoring  
- readiness for persistence, backend sync, or collaboration  

---

## Mental Model

> **The reducer decides _what exists_.**  
> **Cesium decides _how it looks_.**
