import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from cache import get_cache, set_cache

cached = get_cache(query)
if cached:
    return cached


from routers import chat


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


app.include_router(chat.router)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5432)
