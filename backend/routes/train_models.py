from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import traceback

from database.mongo import db
from models.linear_regression import train_linear_regression
from models.random_forest import train_random_forest
from models.k_means import train_kmeans
from models.svm import train_svm
from models.all import select_best_model  # Auto-selection logic

router = APIRouter()


class TrainRequest(BaseModel):
    collection_name: str
    model_type: str
    auto_model_selection: bool


@router.post("/train-model")
async def train_model(request: TrainRequest):
    try:
        # Validate collection
        if not isinstance(request.collection_name, str) or not request.collection_name.strip():
            raise HTTPException(status_code=400, detail="Invalid collection_name. Must be a non-empty string.")

        collections = db.list_collection_names()
        if request.collection_name not in collections:
            raise HTTPException(status_code=404, detail="Specified collection not found.")

        data = list(db[request.collection_name].find({}, {"_id": 0}))
        if not data:
            raise HTTPException(status_code=404, detail="No data found in the specified collection.")

        df = pd.DataFrame(data)
        if df.empty:
            raise HTTPException(status_code=400, detail="Dataset is empty.")

        # Detect target column
        target = detect_target_column(df)

        # Train model
        if request.auto_model_selection:
            result = select_best_model(
                request.collection_name,
                test_size=0.2,
            )
            model_name = result["best_model"]
        else:
            model_name = request.model_type
            if model_name == "random_forest":
                result = train_random_forest(request.collection_name, target)
            elif model_name == "svm":
                result = train_svm(request.collection_name)
            elif model_name == "linear_regression":
                result = train_linear_regression(request.collection_name)
            elif model_name == "k_means":
                result = train_kmeans(request.collection_name)
            else:
                raise HTTPException(status_code=400, detail="Unsupported model type.")

        return {
            "message": "Model trained and saved successfully.",
            "model_type": model_name,
            "file_id": str(result.get("file_id")),
            "filename": result.get("filename"),
            "metrics": {
                "rmse": result.get("rmse"),
                "mae": result.get("mae"),
                "r2": result.get("r2"),
                "accuracy": result.get("accuracy")
            }
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")


def detect_target_column(df: pd.DataFrame):
    if df.empty:
        raise ValueError("Dataframe is empty. Cannot detect target column.")

    unique_counts = df.nunique().sort_values()
    for col, count in unique_counts.items():
        if 1 < count < len(df):
            return col
    raise ValueError("No suitable target column found.")
