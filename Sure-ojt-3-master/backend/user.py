from pydantic import BaseModel
class user(BaseModel):
    name: str
    phone: str
    addressNumber: str
    address: str
    email: str