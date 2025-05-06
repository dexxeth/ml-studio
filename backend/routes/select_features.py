from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from database.mongo import db
from preprocessing.preprocessor import preprocess_dataset_from_mongo

router = APIRouter()


class FeatureSelectionRequest(BaseModel):
    mode: str  # "manual" or "auto"
    target_column: str = None
    selected_features: list[str] = None


@router.post("/selected-features/{collection_name}")
async def select_features(collection_name: str, request: FeatureSelectionRequest):
    try:
        # Validate input
        if request.mode not in ["manual", "auto"]:
            raise HTTPException(status_code=400, detail="Invalid mode")

        # Fetch dataset
        raw_docs = list(db[collection_name].find())
        if not raw_docs:
            raise HTTPException(status_code=404, detail="No data found in the collection")

        # Convert to DataFrame
        import pandas as pd
        df = pd.DataFrame(raw_docs)
        if "_id" in df.columns:
            df.drop(columns=["_id"], inplace=True)

        # Apply preprocessor
        collection_name = preprocess_dataset_from_mongo(
            df=df,
            manual_features=request.selected_features if request.mode == "manual" else None,
            manual_target_column=request.target_column if request.mode == "manual" else None
        )

        return {"message": "Preprocessing complete", "processed_collection": collection_name}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
