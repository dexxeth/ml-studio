from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import (
    upload_dataset,
    get_dataset,
    get_features,
    select_features,
    train_models,
    download_model,
    # get_processed_data
)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(upload_dataset.router)
app.include_router(get_dataset.router)
app.include_router(get_features.router)
app.include_router(select_features.router)
# app.include_router(get_processed_data.router)
app.include_router(train_models.router)
app.include_router(download_model.router)
