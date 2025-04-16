from fastapi import APIRouter, UploadFile, File
import pandas as pd
import numpy as np
import io
import json
import datetime

routes = APIRouter()

@routes.post("/process")
async def excelToJSON(file: UploadFile = File(...)):
    contents = await file.read()
    
    df = pd.read_excel(io.BytesIO(contents), sheet_name=None, header=None)
    
    structured_json = {}
    
    for name, data in df.items():
        data = data.dropna(how="all")
        data = data.dropna(axis=1, how='all')
        data.reset_index(drop=True, inplace=True)
        
        header_row = None
        for i, row in data.iterrows():
            valid_cols = row.dropna()
            if len(valid_cols) == len(data.columns):
                header_row = i
                break
                
        if header_row is None:
            return {"error": "Could not find headers"}
        
        # Extract the headers from the identified header row
        headers = data.iloc[header_row].tolist()
        
        # Create a new DataFrame that ONLY includes data after the header row
        new_data = pd.DataFrame(data.iloc[header_row+1:].values, columns=headers)
        
        new_data = new_data.replace({np.nan: None})
        
        structured_json = new_data.to_dict(orient="records")

    structured_json = convert_keys_to_strings(structured_json)
    print(structured_json)
    return {
        "message": "Excel processed Successfully",
        "structured_data": structured_json,
        "filename": file.filename
    }

def convert_keys_to_strings(data):
    if isinstance(data, dict):
        return {str(k): convert_keys_to_strings(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_keys_to_strings(i) for i in data]
    # handle date time unserializable
    elif isinstance(data, (datetime.datetime)):
        return data.isoformat()
    else:
        return data