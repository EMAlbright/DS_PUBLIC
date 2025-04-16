from typing import Dict, Type, Any, List, Union
from fastapi import FastAPI, HTTPException, APIRouter, Body
from pydantic import BaseModel, create_model
import json
import uvicorn

routes = APIRouter()
TYPE_MAPPING = {
    "int": int,
    "str": str,
    "float": float,
    "bool": bool,
    "dict": dict,
    "list": list
}

# Store dynamic endpoints
endpoints = {}
field_data = {}

@routes.post("/process")
async def processAPI(data: List[Dict[str, Any]] = Body(...)):
    global field_data
    field_data.clear()
    
    # case its the gemma and only one object
    new_data=[]
    if len(data) == 1:
        # go through each base value (key) in the large dict and wrap it
        for k, v in data[0].items():
            if isinstance(v, dict):
                new_data.append({k: v})
            elif isinstance(v, list):
                if isinstance(v[0], dict):
                    new_data.append({k: v})
                else:
                    new_data.append({k:v})
            else:
                new_data.append({k:v})
        data = new_data

    for idx, entry in enumerate(data):
        endpoint_name = f"{idx+1}"
        endpoint_from_json(entry, endpoint_name)

        for key, value in entry.items():
            key = key.lower().replace(" ", "_")
            if key not in field_data:
                field_data[key] = []
            # based on each key grab EP
            field_data[key].append(value)

    return {"message": "API Endpoints Created Successfully", 
            "endpoints": list(endpoints.keys()),
            "fieldData": list(field_data)}


# Methods for API CREATION

# Get the schema for the json
def json_to_schema(data: Dict[str, Any], depth=0, max_depth=3) -> Dict[str, Any]:
    schema = {}
    # recursively iterate over dictionary values
    if isinstance(data, dict):
        for k, v in data.items():
            key = k.strip()
            # case dicitionary
            if isinstance(v, dict) and depth < max_depth:
                # define type and go further intro structure
                schema[key] = {"type": "object", "properties": json_to_schema(v, depth+1, max_depth)}
            # case list
            elif isinstance(v, list) and v and isinstance(v[0], dict) and depth < max_depth:
                # define type and go further into structure
                schema[key] = {"type": "array", "items": json_to_schema(v[0], depth+1, max_depth)}
            else:
                # case no value
                if v is None:
                    schema[key] = {"type": "null"}
                # case primitive value
                else:
                    schema[key] = {"type": type(v).__name__}
    return schema

# Create the model for fastAPI
def create_pydantic_model(name: str, schema: Dict[str, any]) -> Type[BaseModel]:
    field_definitions = {}
    annotations = {}
    
    for k, v in schema.items():
        if isinstance(v, dict) and "type" in v:
            if v["type"] == "object" and "properties" in v:
                # Handle nested objects
                nested_model = create_pydantic_model(f"{name}_{k}", v["properties"])
                annotations[k] = nested_model
                field_definitions[k] = (nested_model, None)
            elif v["type"] == "array" and "items" in v and "properties" in v["items"]:
                # Handle arrays of objects
                item_model = create_pydantic_model(f"{name}_{k}_item", v["items"]["properties"])
                annotations[k] = List[item_model]
                field_definitions[k] = (List[item_model], None)
            else:
                # Handle primitive types
                field_type = TYPE_MAPPING.get(v["type"], Any)
                annotations[k] = field_type
                field_definitions[k] = (field_type, None)
    
    return create_model(name, **field_definitions)

# Get endpoints based on json input
# TODO dont just have a sequence (1, 2, 3...) id for each json val
# TODO or maybe do have it
# can be list or dictionary
def endpoint_from_json(json_data: Union[Dict, List], endpoint_name: str):
    # handle objects and arrays
    if isinstance(json_data, list):
        if json_data and isinstance(json_data[0], dict):
            schema_temp = json_data[0]
            data_list = json_data
        else:
            raise ValueError("Array must contain at least one object")
    else:
        schema_temp = json_data
        data_list = [json_data]

    inferred_schema = json_to_schema(schema_temp)

    model = create_pydantic_model(endpoint_name.capitalize(), inferred_schema)
    # store data for later use
    endpoints[endpoint_name] = {"model": model, "data": data_list, "schema": inferred_schema}

# create endpoints past the index
# each key has its own endpoint
# if has the same key, add that data to ep

# ENDPOINTS

@routes.get("/all_data_raw/data")
async def get_all():
    if not endpoints:
        return {"message": "No data available. Process data first."}
    all_data = {key: value["data"] for key, value in endpoints.items()}
    return all_data

# endpoint for keys of the json data
@routes.get("/by_field_name/{field_name}")
async def get_field(field_name: str):
    if field_name in field_data:
        return {field_name: field_data[field_name]}
    raise HTTPException(status_code=404, detail="Field Not Found")

# get all data for an entity
@routes.get("/by_index/{endpoint_id}")
async def get_items(endpoint_id: str):
    if endpoint_id in endpoints:
        return endpoints[endpoint_id]["data"] 
    raise HTTPException(status_code=404, detail="Field Not Found")

# get schema for endpoint
@routes.get("/by_index/{endpoint_id}/schema")
async def get_schema(endpoint_id: str):
    if endpoint_id in endpoints:
        return endpoints[endpoint_id]["schema"]   
    raise HTTPException(status_code=404, detail="Field Not Found")



 


