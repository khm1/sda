import { isAxiosError } from 'axios';
import { apiInstance } from './axiosConfig';

// 관리자 로그인
export async function AdminloginAPI(payload) {
  try {
    const result = await apiInstance().post('/adminLogin', payload);
    return result;
  } catch (err) {
    return err;
  }
}

export async function AdminLinkGenerator(payload) {
  const result = await apiInstance().post('/linkGenerator', payload);
  return result;
}

export async function AdminGetAllForm(page) {
  const result = await apiInstance().get(`/get_forms?page=${page}`);
  return result;
}
