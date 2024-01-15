from fastapi import APIRouter, HTTPException, status
import sqlite3
import time
from pydantic import BaseModel
import json

class address(BaseModel):
    address: str
    addressNumber: str
    userId: str

router = APIRouter(
	prefix="",
    tags=["address"]
)

# 주소 추가
@router.post("/addAddress")
def add_address(addressInfo: address):
    con = sqlite3.connect('./test.db')
    cur = con.cursor()

    addrId = addressInfo.userId + "_" + str(time.time())
    cur.execute("INSERT INTO Address (addrId, address, addressNumber, userId) VALUES (?, ?, ?, ?);", (addrId, addressInfo.address, addressInfo.addressNumber, addressInfo.userId))

    con.commit()

    result = {
        "addressId": addrId
    }

    cur.close()
    con.close()
    
    return result