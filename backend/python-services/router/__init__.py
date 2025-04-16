from fastapi import APIRouter

routes = APIRouter()

from .csv_processor import routes as csv_router
from .excel_processor import routes as excel_router
from .pdf_processor import routes as pdf_router
from .txt_processor import routes as txt_router
from .gemma_processor import routes as gemma_router
from .api_processer import routes as api_router

routes.include_router(csv_router, prefix="/csv")
routes.include_router(excel_router, prefix="/excel")
routes.include_router(pdf_router, prefix="/pdf")
routes.include_router(txt_router, prefix="/txt")
routes.include_router(gemma_router, prefix="/gemma")
routes.include_router(api_router, prefix="/api")