from pydantic import BaseModel



class PayloadDetail(BaseModel):
    field_name: str
    description: str

class AIExplanationSchema(BaseModel):
    summary: str
    suggested_fix: str
    payload_details: list[PayloadDetail]