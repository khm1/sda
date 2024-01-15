import { http } from 'msw';
import {
  mockCreateUserInfo,
  mockGetAdminForm,
  mockGetEntry,
  mockGetUserData,
  mockLinkGenerator,
  mockPostAddAdress,
  mockPostAdminLogin,
  mockUpdateUserData,
  mockUserLogin,
} from './resolvers';

const baseURL = 'http://localhost:8000';
export const handlers = [
  /* user id를 이용해서 User 정보를 가져오는 API */
  http.get(baseURL + '/get_form', mockGetAdminForm), // admin page 모든 폼 받아오기
  http.post(baseURL + '/login', mockUserLogin), // user 로그인
  http.get(baseURL + '/get_user_data', mockGetUserData), // 유저 정보 받아오기
  http.get(baseURL + `/getEntry?formId=1`, mockGetEntry), // 엔트리값 받아오기
  http.post(baseURL + '/create_user', mockCreateUserInfo), // 유저 정보 등록,
  http.post(baseURL + '/update_user_data', mockUpdateUserData), // 유저데이터 업데이트
  http.post(baseURL + '/linkGenerator', mockLinkGenerator), // 링크 전환시켜줌
  http.post(baseURL + '/adminLogin', mockPostAdminLogin),
  http.post(baseURL + '/addAddress', mockPostAddAdress),
];
