from fastapi import APIRouter, HTTPException, status
import sqlite3

router = APIRouter(
	prefix="",
    tags=["entry"]
)

@router.get("/getEntry")
def get_entry(formId: str):
    con = sqlite3.connect('./test.db')
    cur = con.cursor()

    cur.execute("SELECT received_url, nameEntry, phoneEntry, addrNumberEntry, addrEntry, emailEntry FROM FormUrl WHERE id=" + formId)
    output = cur.fetchall()
    if (len(output) <= 0):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid formId"
        )

    data = output[0]

    form = {
        'received_url': data[0],
        'nameEntry': data[1],
        'phoneEntry': data[2],
        'addrNumberEntry': data[3],
        'addrEntry': data[4],
        'emailEntry': data[5]
    }
    
    cur.close()
    con.close()

    return form