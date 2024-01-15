from pydantic import BaseModel
class user(BaseModel):
    userId: str
    name: str
    phone: str
    email: str
    addrId: str