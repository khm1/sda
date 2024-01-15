from pydantic import BaseModel
class userForUpdate(BaseModel):
    userId: str
    name: str
    phone: str
    addrId: str
    email: str