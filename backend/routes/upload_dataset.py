from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from io import BytesIO
from datetime import datetime
import pandas as pd

from database.mongo import db

router = APIRouter()


@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    content = await file.read()
    file_obj = BytesIO(content)

    try:
        if file.filename.lower().endswith(".csv"):
            df = pd.read_csv(file_obj)
        elif file.filename.lower().endswith((".xls", ".xlsx")):
            df = pd.read_excel(file_obj)
        else:
            return JSONResponse({"error": "Unsupported file format"}, status_code=400)
    except Exception as e:
        return JSONResponse({"error": f"Failed to parse file: {str(e)}"}, status_code=400)

    uploaded_filename = file.filename
    timestamp = datetime.now().strftime("%d%m%Y_%H%M%S")

    raw_collection_name = f"dataset_{timestamp}"
    raw_collection = db[raw_collection_name]

    try:
        records = df.to_dict(orient="records")
        inserted = raw_collection.insert_many(records)
    except Exception as e:
        return JSONResponse({"error": f"Failed to upload dataset: {str(e)}"}, status_code=500)

    return {
        "message": "Dataset uploaded successfully",
        "raw_collection": raw_collection_name,
        "file_name": uploaded_filename,
        "row_count": len(inserted.inserted_ids)
    }
