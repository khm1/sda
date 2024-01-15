from pydantic import BaseModel
class url(BaseModel):
    name: str
    received_url: str