import { apiInstance } from './axiosConfig';

// 폼 관련 데이터 조회
export async function getFormsAPI(page) {
  try {
    const result = await apiInstance().get(`/get_forms?page=${page}`);
    return result;
  } catch (error) {
    console.log('에러: ', error);
    return error;
  }
}

// 구글 폼 내의 entry값 조회
export async function getEntry(formId) {
  try {
    const result = await apiInstance().get(`/getEntry?formId=${formId}`);
    return result;
  } catch (error) {
    console.log('에러: ', error);
    return error;
  }
}
