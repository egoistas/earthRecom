from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Literal, Optional

app = FastAPI()

class LLH(BaseModel):
    lon: float
    lat: float
    h: float = 0.0

class FeaturePoint(BaseModel):
    id: str
    kind: Literal["risk", "bonus", "no_fly"]
    lon: float
    lat: float
    h: float = 0.0
    severity: float = 1.0
    radius_m: float = 300.0
    alt_min: Optional[float] = None
    alt_max: Optional[float] = None

class RouteRequest(BaseModel):
    start: LLH
    goal: LLH
    features: List[FeaturePoint] = []
    vehicle: dict = {}

class RouteResponse(BaseModel):
    path: List[LLH]
    cost: float

@app.post("/route", response_model=RouteResponse)
def route(req: RouteRequest):
    path = [req.start, req.goal]
    cost = 0.0
    return RouteResponse(path=path, cost=cost)
