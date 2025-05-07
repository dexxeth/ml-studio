from fastapi import APIRouter
from fastapi.responses import JSONResponse
from utils.clean_nan_inf import clean_nan_inf

from database.mongo import db

router = APIRouter()


@router.get("/dataset/{collection_name}")
def get_dataset(collection_name: str):
    try:
        collection = db[collection_name]
        dataset = list(collection.find({}, {"_id": 0}))
        if not dataset:
            return JSONResponse(content={"error": "No dataset found"}, status_code=404)
    except Exception as e:
        return JSONResponse(content={"error": f"Failed to fetch dataset: {e}"}, status_code=500)

    cleaned_dataset = clean_nan_inf(dataset)
    return {"dataset": cleaned_dataset}