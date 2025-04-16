from fastapi import APIRouter, UploadFile, File
import pandas as pd
import io
import csv

routes = APIRouter()

@routes.post("/process")
async def processCSV(file: UploadFile = File(...)):
    contents = await file.read()

    # Decode and preprocess file to remove problematic quotes
    decoded = contents.decode("utf-8").replace('"', '')  # Removes all quotes

    # Read CSV with error handling
    df = pd.read_csv(io.StringIO(decoded), quoting=csv.QUOTE_NONE, on_bad_lines="skip", skip_blank_lines=True)

    # Strip spaces from column headers
    df.columns = df.columns.str.strip()

    structured_json = df.to_dict(orient="records")

    return {
        "message": "CSV processed successfully",
        "structured_data": structured_json,
        "filename": file.filename
    }
