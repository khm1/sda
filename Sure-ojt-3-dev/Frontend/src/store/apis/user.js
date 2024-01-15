import { apiInstance } from './axiosConfig';

// 로그인과 데이터 조회
export async function loginAPI(payload) {
  try {
    const result = await apiInstance().post('/login', { token: payload });

    return result;
  } catch (error) {
    return error;
  }
}

// 사용자 데이터 업데이트
export async function updateUserDataAPI(payload) {
  try {
    const result = await apiInstance().post('/update_user_data', payload);
    return result;
  } catch (error) {
    return error;
  }
}

// 사용자 정보 조회
export async function getUserDataAPI(userId) {
  try {
    const result = await apiInstance().get(`/get_user_data?userId=${userId}`);
    console.log(result, '로그인 유저 정보조회');
    return result;
  } catch (error) {
    console.log('에러: ', error.response);
    return error;
  }
}

// 사용자 주소 추가
export async function addAddressAPI(payload) {
  try {
    const result = await apiInstance().post('/addAddress', payload);
    return result;
  } catch (err) {
    return err;
  }
}

// 사용자 기본 정보 등록
export async function createUserAPI(payload) {
  try {
    const result = await apiInstance().post('/create_user', payload);
    return result;
  } catch (err) {
    return err;
  }
}
