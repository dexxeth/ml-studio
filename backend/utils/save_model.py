# utils/save_model.py
import pickle
import io
from gridfs import GridFS
from datetime import datetime
from database.mongo import db

def save_model(model, model_name: str, metrics: dict):
    fs = GridFS(db)
    buffer = io.BytesIO()
    pickle.dump(model, buffer)
    buffer.seek(0)

    timestamp = datetime.now().strftime("%d%m%Y_%H%M%S")
    file_id = fs.put(buffer, filename=f"{model_name}_{timestamp}")

    model_collection = db[f"trained_model_{timestamp}"]
    model_collection.insert_one({
        "model_name": model_name,
        "file_id": file_id,
        "timestamp": timestamp,
        **metrics
    })

    return str(file_id), f"{model_name}_{timestamp}"
