# Entry Point For Python Services
# Processing file types
# Turning to json
# json to RESTapi
import uvicorn
from fastapi import FastAPI
from router import routes

app = FastAPI()
app.include_router(routes)

if __name__ == "__main__":
    uvicorn.run(app, port=5000)
