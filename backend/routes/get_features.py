from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database.mongo import db

router = APIRouter()

@router.get("/get-features/{collection_name}")
async def get_features(collection_name: str):
    try:
        collection = db[collection_name]
        dataset = collection.find_one()

        if not dataset:
            return JSONResponse(content={"error": "No dataset found"}, status_code=404)

        features = list(dataset.keys())
        if "_id" in features:
            features.remove("_id")

        return {"features": features}
    except Exception as e:
        return JSONResponse(content={"error": f"Failed to fetch features: {str(e)}"}, status_code=500)
