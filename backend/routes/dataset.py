from fastapi import APIRouter, UploadFile, File
import pandas as pd
from config.database import dataset_collection
from io import BytesIO
from fastapi.responses import JSONResponse
import math

router = APIRouter()


@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    content = await file.read()
    filename = file.filename

    file_obj = BytesIO(content)
    try:

        if filename.endswith(".csv"):
            df = pd.read_csv(file_obj)
        elif filename.endswith(".xlsx"):
            df = pd.read_excel(file_obj)
        else:
            return {"error": "Unsupported file format"}
    except Exception as e:
        return {"error": f"failed to parse file: {str(e)}"}

    try:
        dataset = df.to_dict(orient="records")
        inserted = dataset_collection.insert_many(dataset)
        return {"message": "Dataset uploaded successfully", "count": len(inserted.inserted_ids)}
    except Exception as e:
        return {"error": f"Failed to upload dataset: {str(e)}"}


def clean_nan_inf(obj):
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None  # or a string like "NaN"
        return obj
    elif isinstance(obj, dict):
        return {k: clean_nan_inf(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_nan_inf(v) for v in obj]
    return obj


@router.get("/dataset")
def get_dataset():
    try:
        dataset = list(dataset_collection.find({}, {"_id": 0}))
        if not dataset:
            return JSONResponse(content={"error": "No dataset found"}, status_code=404)

        # Clean NaNs and Infs
        cleaned_dataset = clean_nan_inf(dataset)

        return {"dataset": cleaned_dataset}
    except Exception as e:
        return JSONResponse(content={"error": f"Failed to fetch dataset: {str(e)}"}, status_code=500)
    
