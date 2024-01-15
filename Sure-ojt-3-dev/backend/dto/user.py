from pydantic import BaseModel
class user(BaseModel):
    userId: str
    name: str
    phone: str
    addressNumber: str
    address: str
    email: str