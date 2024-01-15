from pydantic import BaseModel
class url(BaseModel):
    title: str
    received_url: str