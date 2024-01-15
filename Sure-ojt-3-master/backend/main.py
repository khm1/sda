from typing import Union
from dto.admin import admin
from dto.user import user
from dto.url import url
from dto.token import token
import form
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi import FastAPI, HTTPException, status
from datetime import datetime
import sqlite3
import json
import requests
from bs4 import BeautifulSoup as bs
from fastapi import HTTPException
import re
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.include_router(form.router)
# CORS 정책 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 허용할 origin을 지정해야 하며, 필요에 따라 변경 가능
    allow_credentials=True,
    allow_methods=["*"],  # 요청 허용 메서드, 필요에 따라 변경 가능
    allow_headers=["*"],  # 요청 허용 헤더, 필요에 따라 변경 가능
)

def init():
    con = sqlite3.connect('./test.db')
    cur = con.cursor()
    # form 데이터 테이블 생성

    cur.execute("CREATE TABLE IF NOT EXISTS FormUrl(id text, urlName text, received_url text, generated_url text, generated_date date, nameEntry text, phoneEntry text, addrNumberEntry text ,addrEntry text, emailEntry text);")
    # 유저 데이터 테이블 생성

    cur.execute("CREATE TABLE IF NOT EXISTS User(userId text, name text, addressNumber text, address text, phone text, email text);")
    # 관리자 전용 테이블 셍성
    cur.execute("CREATE TABLE IF NOT EXISTS Admin(id text, password text);")
    cur.close()
    con.close()
init()
# init()
# 들어온 link를 바탕으로 db에 저장돼있는지 확인
# 없으면 새로 생성 후 db에 저장
# 도메인 주소가 필요하다....
@app.post("/linkGenerator")
def link_generator(url: url):
    con = sqlite3.connect('./test.db')
    cur = con.cursor()
    id = 0
    id += 1
    received_url = url.received_url
    url_name = url.name
    nameEntry, phoneEntry, addrNumberEntry ,addrEntry, emailEntry = get_entry_id(received_url)
    cur.execute("INSERT INTO FormUrl Values(?,?, ?, ?, ?, ?,?, ?,?,?);", (id, url_name, received_url, "127.0.0.1/"+ str(id), datetime.now(), nameEntry, phoneEntry, addrNumberEntry ,addrEntry, emailEntry))
    cur.execute("SELECT * from FormUrl;")
    rows = cur.fetchall()
    for r in rows:
        print(r)
    cur.close()
    con.close()
    return "127.0.0.1/"+ str(id)

def get_entry_id(received_url: str):
    response = requests.get(received_url)
    html = bs(response.text, 'html.parser')
    scripts = html.find_all('script')
    nameEntry = ""
    phoneEntry = ""
    addrNumberEntry = "" 
    addrEntry = ""
    emailEntry="" 
    # 스크립트 태그 내용에서 원하는 데이터를 찾습니다.
    
    for script in scripts:
        script_content = script.get_text()

        if "이름" in script_content:
            pattern = re.compile(r'"이름.*?,null,\d+,\[\[(\d+),null,\d+\]\]')
            match = pattern.search(script_content)
            if match:
                target_number = match.group(1)
                nameEntry = target_number
        if "우편번호" in script_content:
            pattern = re.compile(r'"우편번호",null,\d+,\[\[(\d+),null,\d+\]\]')
            match = pattern.search(script_content)
            if match:
                target_number = match.group(1)
                addrNumberEntry = target_number        

        if "주소" in script_content:
            
            pattern = re.compile(r'"주소",null,\d+,\[\[(\d+)')
            match = pattern.search(script_content)
            if match:
                target_number = match.group(1)
                addrEntry = target_number

        if "전화번호" in script_content:
           
            pattern = re.compile(r'"전화번호",null,\d+,\[\[(\d+)')
            match = pattern.search(script_content)
            if match:
                target_number = match.group(1)
                phoneEntry = target_number
        if "이메일" in script_content:
           
            pattern = re.compile(r'"이메일",null,\d+,\[\[(\d+)')
            match = pattern.search(script_content)
            if match:
                target_number = match.group(1)
                emailEntry = target_number
    return [nameEntry, phoneEntry, addrNumberEntry ,addrEntry, emailEntry]
   
#link_generator('ㅇㅂㅈ','https://forms.gle/pMzRDxbx178zwBVq9')

@app.get("/get_form_url")
def get_form_url():
    con = sqlite3.connect('./test.db')
    cur = con.cursor()

    # FormUrl 테이블에서 모든 데이터 조회
    cur.execute("SELECT * FROM FormUrl")
    rows = cur.fetchall()

    # 데이터를 담을 리스트 초기화
    form_urls = []

    # 각 row를 순회하며 JSON 형태로 변환 후 리스트에 추가
    for row in rows:
        url_name, received_url, transformed_url = row[0], row[1], row[2]
        form_url_data = {"title": url_name, "received_url": received_url, "generated_url": transformed_url}
        form_urls.append(form_url_data)

    cur.close()
    con.close()
    return JSONResponse(content=jsonable_encoder(form_urls))



# 관리자 로그인 관련
# 관리자 계정 등록
@app.post("/adminRegister") 
def admin_Register(ad: admin):
    con = sqlite3.connect('./test.db')
    cur = con.cursor()

    # id 존재 여부 확인
    if(exist_admin_id(cur, ad.id)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Existed id"
        )
    
    cur.execute("INSERT INTO Admin Values(?, ?);", (ad.id, ad.password))
    cur.close()
    con.close()

# 관리자 로그인
@app.post("/adminLogin")
def admin_login(ad: admin):
    con = sqlite3.connect('./test.db')
    cur = con.cursor()

    # id 존재 여부 확인

    # cur.close() 부분 삭제 
    if(exist_admin_id(cur, ad.id) == False):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect id"
        )
    

    # password 검사
    cur.execute("SELECT COUNT(*) FROM Admin WHERE id=? AND password=?;", (ad.id, ad.password))
    data = cur.fetchone()
    cur.close()
    con.close()
    if (data[0] > 0) :
        return jsonable_encoder({
            'id': ad.id,
            'authority': "admin"
        })
    else :
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )
    
    
# admin id 검색
# 존재하면 True, 그렇지 않으면 False
def exist_admin_id(cur, id: str):
    
    cur.execute("SELECT COUNT(*) FROM Admin WHERE id=?;", (id, ))
    data = cur.fetchone()

    # cur.close() 삭제
    # con.close() 삭제
    # 오류 수정

    if (data[0] <= 0) :
        return False
    else :
        return True


@app.post("/login")
def login(token: token):
    ## 클라이언트에서 accecss token이 발급후 전달했다고 가정
    # 토큰 검증
    if verify_token(token.token):
        userId = get_user_data_line(token.token)
        if userId:
            print("전송완료")
            return "OK"
        else:
            # userId가 False인 경우 처리
            raise HTTPException(status_code=500, detail="사용자 정보를 가져올 수 없습니다.")
    else:
        # 토큰이 유효하지 않은 경우 처리
        raise HTTPException(status_code=500, detail="유효하지 않은 토큰입니다.")



# 저장된 db에서 유저 정보 가져오기
@app.get("/get_user_data")
def get_user_data(userId: str):
    con = sqlite3.connect('./test.db')
    cur = con.cursor()
    cur.execute("SELECT name, addrId, email, phone FROM User WHERE userId = ?;", (userId, ))
    data = cur.fetchall()
    cur.close()
    
    result = []
    for user in data:
        result.append({
            'name': user[0],
            'addrId': user[1],
            'email': user[2],
            'phone': user[3],
        })

    return result


@app.post("/create_user")
def save_user_data(user: user):
    con = sqlite3.connect('./test.db')
    cur = con.cursor()
    #UserId text, name text, address text, addressNumber text, phone text, email text)
    cur.execute("INSERT INTO User Values(?, ?, ?, ?, ?);", (user.userId ,user.name, user.phone, user.email, user.addrId))
    cur.close()
    con.close()

def verify_token(token: str):
    ## 받아온 토큰 유효성 검사
    response = requests.get('https://api.line.me/oauth2/v2.1/verify', params= {'access_token': token})
    print("token 확인"+ token)
    if response.status_code == 200:
        # 성공적인 응답 처리
        print("토큰이 유효합니다.")
        return True
        # 추가적인 작업 수행 가능
    else:
        # 실패한 응답 처리
        print("토큰이 유효하지 않습니다.")
        return False
        # 추가적인 작업 수행 가능


def get_user_data_line(token: str):
    headers = {'Authorization': "Bearer "+ token}
    # access_token으로 유저 정보 받아오기
    response = requests.get('https://api.line.me/v2/profile', headers= headers)
    if response.status_code == 200:
        # 성공적인 응답 처리
        data =json.loads(response.text)
        return data["userId"]
        ## userId
        ##return response.sub
        # 추가적인 작업 수행 가능
    else:
        # 실패한 응답 처리
        print("실패.")
        return False
        # 추가적인 작업 수행 가능
        

# 유저 정보 수정하기
@app.post("/update_user_data")
def update_user_data(user_data: user):
    con = sqlite3.connect('./test.db')
    cur = con.cursor()
    cur.execute("UPDATE User SET name = ?, phone = ?, email = ?, addrId = ?  WHERE userId = ?;", (user_data.name, user_data.phone, user_data.email, user_data.addrId, user_data.userId))
    cur.close()
    con.close()
