from fastapi import UploadFile, File, APIRouter
from httpx import AsyncClient
import asyncio
import json

routes = APIRouter()

gemmaEP = "http://localhost:5000/gemma/process"

@routes.post("/process")
async def txtToJSON(file: UploadFile = File(...)):
    try:
        # convert byte file to string
        text_data = await file.read()
        string_data = text_data.decode("utf-8")
        print(f"Text Process endpoint received:{string_data}")
        
        gemma_payload = {"text": string_data}
        
        # Use async HTTP client with timeout
        async with AsyncClient() as client:
            try:
                # Set a longer timeout since text processing can take time
                gemma_response = await client.post(
                    gemmaEP, 
                    json=gemma_payload, 
                    timeout=500.0  
                )
                                
                if gemma_response.status_code != 200:
                    error_text = gemma_response.text
                    return {"error": f"Error processing with Gemma: {error_text}"}
                
                structured_json = gemma_response.json()
                return_json = [structured_json]
                # serialize
                return {
                    "message": "Text processed successfully",
                    "structured_data": return_json,
                    "filename": file.filename
                }
            except asyncio.TimeoutError:
                return {"error": "Gemma processing timed out after 2 minutes"}
            except Exception as e:
                return {"error": f"Error processing with Gemma: {str(e)}"}
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}"}
