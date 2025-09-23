from fastapi import FastAPI, HTTPException, Header, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from datetime import datetime

app = FastAPI()

# Enable CORS so your frontend can access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins, or replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your Weatherstack API key
API_KEY = "1908153cff66fadc3c1d679a24f04d34"

# API key verification dependency
def verify_api_key(
    x_api_key: str = Header(default=None),
    api_key_query: str = Query(default=None)
):
    key = x_api_key or api_key_query
    if key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API Key")

# Simple item example (optional)
class Item(BaseModel):
    text: str = None
    is_done: bool = False

items = []

@app.get("/")
def root():
    return {"Hello": "World"}

@app.post("/items", dependencies=[Depends(verify_api_key)])
def create_item(item: Item):
    items.append(item)
    return items

@app.get("/items", response_model=list[Item], dependencies=[Depends(verify_api_key)])
def list_items(limit: int = 10):
    return items[0:limit]

@app.get("/items/{item_id}", response_model=Item, dependencies=[Depends(verify_api_key)])
def get_item(item_id: int) -> Item:
    if item_id < len(items):
        return items[item_id]
    else:
        raise HTTPException(status_code=404, detail=f"Item {item_id} not found")

# Flexible weather endpoint for any city
@app.get("/weather/{city}", dependencies=[Depends(verify_api_key)])
def get_weather(city: str):
    url = f"http://api.weatherstack.com/current?access_key={API_KEY}&query={city}&units=m"
    response = requests.get(url)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Error fetching weather data")

    data = response.json()
    if "error" in data:
        raise HTTPException(status_code=500, detail=data["error"].get("info", "Unknown error"))

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    return {
        "datetime": timestamp,
        "location": data["location"]["name"],
        "country": data["location"]["country"],
        "temperature_c": data["current"]["temperature"],
        "weather_descriptions": data["current"]["weather_descriptions"],
        "wind_speed_kmh": data["current"]["wind_speed"],
        "humidity": data["current"]["humidity"],
        "feelslike_c": data["current"]["feelslike"]
    }
