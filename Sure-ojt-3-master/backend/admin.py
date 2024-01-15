from pydantic import BaseModel

class admin(BaseModel):
    id: str
    password: str