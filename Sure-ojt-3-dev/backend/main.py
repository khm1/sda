from typing import Union
from dto.admin import admin
from dto.user import user
from dto.url import url
from dto.token import token
import form
import urllib
import entry
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi import FastAPI, HTTPException, status
from datetime import datetime
import sqlite3
import json
import os
import requests
from bs4 import BeautifulSoup as bs
from fastapi import HTTPException
import re
from fastapi.middleware.cors import CORSMiddleware
import time
from dto.userForUpdate import userForUpdate
import address
from dotenv import load_dotenv
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

app = FastAPI()
app.include_router(form.router)
app.include_router(entry.router)
# CORS 정책 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 허용할 origin을 지정해야 하며, 필요에 따라 변경 가능
    allow_credentials=True,
    allow_methods=["*"],  # 요청 허용 메서드, 필요에 따라 변경 가능
    allow_headers=["*"],  # 요청 허용 헤더, 필요에 따라 변경 가능
)
app.include_router(address.router)

def init():
    con = sqlite3.connect('./test.db')
    cur = con.cursor()

    # form 데이터 테이블 생성

    cur.execute("CREATE TABLE IF NOT EXISTS FormUrl(id INTEGER PRIMARY KEY AUTOINCREMENT, urlName text, received_url text, generated_url text, generated_date date, nameEntry text, phoneEntry text, addrNumberEntry text ,addrEntry text, emailEntry text);")
    # 유저 데이터 테이블 생성
    cur.execute("CREATE TABLE IF NOT EXISTS User(userId text, name text, addrId text, phone text, email text);")
    # 유저 주소 데이터 테이블 생성
    cur.execute("CREATE TABLE IF NOT EXISTS Address(addrId text, address text, addressNumber text, userId text);")
    # 관리자 전용 테이블 셍성
    cur.execute("CREATE TABLE IF NOT EXISTS Admin(id text, password text);")

    cur.close()
    con.close()

init()
id = 0
# 들어온 link를 바탕으로 db에 저장돼있는지 확인
# 없으면 새로 생성 후 db에 저장
# 도메인 주소가 필요하다....
@app.post("/linkGenerator")
def link_generator(url: url):
    global id
    con = sqlite3.connect('./test.db')
    cur = con.cursor()
    
    id += 1
    received_url = url.received_url
    url_name = url.title
    nameEntry, phoneEntry, addrNumberEntry ,addrEntry, emailEntry = get_entry_id(received_url)
    
    
    cur.execute("INSERT INTO FormUrl (urlName, received_url, generated_url, generated_date, nameEntry, phoneEntry, addrNumberEntry, addrEntry, emailEntry) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
            (url_name, received_url, "", datetime.now(), nameEntry, phoneEntry, addrNumberEntry, addrEntry, emailEntry))
    con.commit()
    last_insert_id = cur.lastrowid
    generated_url = f"http://192.168.103.97:5173/{last_insert_id}"
    cur.execute("UPDATE FormUrl SET generated_url = ? WHERE id = ?", (generated_url, last_insert_id))
    rows = cur.fetchall()
    con.commit()
    cur.close()
    con.close()
    return "http://192.168.103.97:5173/"+ str(last_insert_id)

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
            pattern = re.compile(r'".*?이름.*?",null,\d+,\[\[(\d+),null,\d+\]\]')
            match = pattern.search(script_content)
            if match:
                target_number = match.group(1)
                nameEntry = target_number
        if "우편번호" in script_content:
            pattern = re.compile(r'".*?우편번호.*?",null,\d+,\[\[(\d+),null,\d+\]\]')
            match = pattern.search(script_content)
            if match:
                target_number = match.group(1)
                addrNumberEntry = target_number        

        if "주소" in script_content:
            
            pattern = re.compile(r'".*?주소.*?",null,\d+,\[\[(\d+)')
            match = pattern.search(script_content)
            if match:
                target_number = match.group(1)
                addrEntry = target_number

        if "연락처" in script_content:
           
            pattern = re.compile(r'".*?연락처.*?",null,\d+,\[\[(\d+)')
            match = pattern.search(script_content)
            if match:
                target_number = match.group(1)
                phoneEntry = target_number
        if "이메일" in script_content:
           
            pattern = re.compile(r'".*?이메일.*?",null,\d+,\[\[(\d+)')
            match = pattern.search(script_content)
            if match:
                target_number = match.group(1)
                emailEntry = target_number

    return [nameEntry, phoneEntry, addrNumberEntry ,addrEntry, emailEntry]


#link_generator({'name': "eqwe", 'received_url': 'https://forms.gle/pMzRDxbx178zwBVq9'})


# 관리자 로그인 관련
# 관리자 계정 등록
@app.post("/adminRegister") 
def admin_Register(ad: admin):
    con = sqlite3.connect('./test.db')
    cur = con.cursor()

    # id 존재 여부 확인
    if(exist_admin_id(cur, ad.id)):
        cur.close()
        con.close()

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Existed id"
        )
    
    cur.execute("INSERT INTO Admin Values(?, ?);", (ad.id, ad.password))

    con.commit()
    cur.close()
    con.close()

# 관리자 로그인
@app.post("/adminLogin")
def admin_login(ad: admin):
    con = sqlite3.connect('./test.db')
    cur = con.cursor()

    # id 존재 여부 확인
    if(exist_admin_id(cur, ad.id) == False):
        cur.close()
        con.close()

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
    if (data[0] <= 0) :
        return False
    else :
        return True

def get_access_token(code: str):
    print(code + " code입니다")
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    data = {
        'grant_type': 'authorization_code',
        'code': code,
        'client_id': os.environ["LINE_CHANNEL_ID"],
        'redirect_uri': os.environ["REDIRECT_URI"],
        'client_secret': '36ee7313ee3fed301ddb9091a0f9cd1e'
    }
    # URL 인코딩된 데이터로 변환하여 전송
    response = requests.post('https://api.line.me/oauth2/v2.1/token', headers=headers, data=data)

    if response.status_code != 200:
        # 오류 처리 로직 추가
        pass

    response_data = response.json()
    print(response_data)
    access_token = response_data.get('access_token')
    print(access_token)
    if not access_token:
        # 오류 처리 로직 추가
        pass

    return access_token

def get_userId(token: str):
    con = sqlite3.connect('./test.db')
    cur = con.cursor()
    ## 클라이언트에서 accecss token이 발급후 전달했다고 가정
    # 토큰 검증
    if verify_token(token):
        print("유효성")
        userId = get_user_data_line(token)
        print(userId)
        # userId가 있는 테이블의 사용자정보 가져오기
        cur.execute("SELECT * from User WHERE userId= ?;", (userId,))
        #cur.execute("SELECT * from User;")
        data = cur.fetchall()
        cur.close()
        con.close()
        print(data)
        print(userId)
        #확인용
        ## 새로운 유저
        ## [] => len() == 0
        if len(data) == 0  :
            print("로직성공")
## 비어있는 객체 {"name", ""}
            result = {
                'isUser': False,
                'userId': userId
            }
            print(result)
            return result

        ## 기존 유저
        else: 
            print("사용자의 userId는 %s 입니다.", userId)
            result = {
                'isUser': True,
                'userId': userId
            }
            return result

        
            
    else:
        # 토큰이 유효하지 않은 경우 처리
        raise HTTPException(status_code=500, detail="유효하지 않은 토큰입니다.")


@app.post("/login")
def login(token: token):
    print(token,'token입니다')
    #print("code확인" +  str(token))
    ## code로 access token 받아오기
    ## 받아온 토큰으로 아래 로직 처리
    ##token = get_access_token(code.code)
    result = get_userId(token.token)
    return result


# 저장된 db에서 유저 정보 가져오기
@app.get("/get_user_data")
def get_user_data(userId: str):
    con = sqlite3.connect('./test.db')
    cur = con.cursor()

    cur.execute("SELECT addrId, address, addressNumber FROM Address WHERE userId = ?;", (userId, ))
    data = cur.fetchall()
    print(data,userId,'ddddd')
    if (len(data) <= 0):
        cur.close()
        con.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect id"
        )

    addresses = []
    for address in data :
        temp = {
            'addrId': address[0],
            'address': address[1],
            'addressNumber': address[2],
            'selected': 'false'
        }
        addresses.append(temp)

    cur.execute("SELECT name, addrId, phone, email FROM User WHERE userId = ?;", (userId, ))
    data = cur.fetchall()
    user = data[0]

    for address in addresses:
        if (address['addrId'] == user[1]):
            address['selected'] = 'true'
    
    result = {
        'name': user[0],
        'phone': user[2],
        'email': user[3],
        'addresses': addresses
    }

    cur.close()
    con.close()

    return result


@app.post("/create_user")
def save_user_data(user: user):
    con = sqlite3.connect('./test.db')
    cur = con.cursor()
    #UserId text, name text, addrId text, phone text, email text)
    addrId = user.userId + str(time.time())

    cur.execute("INSERT INTO User (userId, name, addrId, email, phone) VALUES (?, ?, ?, ?, ?);", (user.userId ,user.name, addrId, user.email, user.phone))
    cur.execute("INSERT INTO Address (addrId, address, addressNumber, userId) VALUES (?, ?, ?, ?);", (addrId, user.address, user.addressNumber, user.userId))
    
    con.commit()
    cur.close()
    con.close()

def verify_token(token: str):
    ## 받아온 토큰 유효성 검사
    response = requests.get('https://api.line.me/oauth2/v2.1/verify', params= {'access_token': token})
    #print("token 확인"+ token)
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
def update_user_data(user_data: userForUpdate):
    print(user_data,'userdata 🤣')
    con = sqlite3.connect('./test.db')
    cur = con.cursor()
    print(exist_user_id(cur,user_data.userId), '❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️')
    if (exist_user_id(cur, user_data.userId) == False):
        cur.close()
        con.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect id"
        )

    cur.execute("UPDATE User SET name = ?, addrId = ?, phone = ?, email = ? WHERE userId = ?;", (user_data.name, user_data.addrId, user_data.phone, user_data.email, user_data.userId))
    con.commit()
    cur.close()
    con.close()

# 유저 id 존재 여부 확인
def exist_user_id(cur, userId: str):
    cur.execute("SELECT COUNT(*) FROM User WHERE userId=?;", (userId, ))
    data = cur.fetchone()
    if (data[0] <= 0) :
        return False
    else :
        return True