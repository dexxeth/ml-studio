from fastapi import APIRouter, HTTPException, Response
from bson import ObjectId
from gridfs import GridFS
from database.mongo import db

router = APIRouter()
fs = GridFS(db)

@router.get("/download-model/{file_id}")
def download_model(file_id: str):
    try:
        file = fs.get(ObjectId(file_id))
        content = file.read()
        filename = file.filename or "model.pkl"
        if not filename.endswith(".pkl"): filename += ".pkl"

        return Response(
            content=content,
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Model not found: {str(e)}")
