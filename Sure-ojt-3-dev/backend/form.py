from fastapi import APIRouter, HTTPException, status
import sqlite3
import math

router = APIRouter(
	prefix="",
    tags=["forms"]
)

# 폼 정보들 조회하기
@router.get("/get_forms")
def get_forms(page: str):
    page = int(page)

    page-=1
    one_page_data = 10

    con = sqlite3.connect('./test.db')
    cur = con.cursor()
    
    # output
    result = {
        'total_page': 0,
        'data': []
    }

    # 전체 페이지 수
    cur.execute("SELECT COUNT(*) FROM FormUrl")
    data = cur.fetchone()[0]
    total_page = data / one_page_data + 1
    if (data % one_page_data == 0) :
        total_page -= 1
    else :
        total_page = math.trunc(total_page)
    result['total_page'] = total_page

    if (total_page == 0) :
        result['total_page'] = 1

    # page 예외 처리
    else :
        if (page > total_page or page < 0) :
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid page num"
            )

        # 한 페이지 당 10개
        cur.execute("SELECT id, urlName, received_url, generated_url, generated_date FROM FormUrl ORDER BY generated_date DESC LIMIT " + str(one_page_data) + " OFFSET " + str(page) + " * " + str(one_page_data))
        data = cur.fetchall()

        # 데이터 2차원 배열 → 객체가 저장되어 있는 배열
        for form in data:
            temp = {
                'id': form[0],
                'urlName': form[1],
                'received_url': form[2],
                'generated_url': form[3],
                'generated_date': form[4]
            }
            result['data'].append(temp)

    cur.close()
    con.close()

    return result