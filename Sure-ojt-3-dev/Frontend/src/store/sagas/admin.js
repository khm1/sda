import { all, fork, put, takeLatest, call } from 'redux-saga/effects';
import {
  ADMIN_LOGIN_ERROR,
  ADMIN_LOGIN_REQUEST,
  ADMIN_LOGIN_SUCCESS,
  FORM_CURRENT_PAGE_CHANGE,
  FORM_CURRENT_PAGE_ERROR,
  FORM_CURRENT_PAGE_REQUEST,
  FORM_CURRENT_PAGE_SUCCESS,
  FORM_GENERATE_ERROR,
  FORM_GENERATE_REQUEST,
  FORM_GENERATE_SUCCESS,
  FORM_LIST_FAILURE,
  FORM_LIST_REQUEST,
  FORM_LIST_SUCCESS,
} from '../modules/admin';
import {
  AdminGetAllForm,
  AdminLinkGenerator,
  AdminloginAPI,
} from '../apis/admin';

function* loadAllForm(action) {
  try {
    const result = yield call(AdminGetAllForm, action.data);
    yield put({
      // 수행되어야하는 action 및 data 주입
      type: FORM_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: FORM_LIST_FAILURE,
      data: err,
    });
  }
}

function* watchLoadForm() {
  yield takeLatest(FORM_LIST_REQUEST, loadAllForm);
}

function* uploadURL(action) {
  try {
    yield call(AdminLinkGenerator, action.data); // url api 주입
    yield put({
      type: FORM_GENERATE_SUCCESS,
    });
    yield put({
      type: FORM_CURRENT_PAGE_REQUEST,
      data: 1,
    }); // all form 정보 reloading
  } catch {
    yield put({
      type: FORM_GENERATE_ERROR,
    });
  }
}

function* watchLoadURL() {
  yield takeLatest(FORM_GENERATE_REQUEST, uploadURL);
}

function* LoginAdmin(action) {
  try {
    console.log(action, 'action');
    yield call(AdminloginAPI, action.data);
    yield put({
      type: ADMIN_LOGIN_SUCCESS,
    });
  } catch {
    yield put({
      type: ADMIN_LOGIN_ERROR,
    });
  }
}

function* watchAdminLogin() {
  yield takeLatest(ADMIN_LOGIN_REQUEST, LoginAdmin);
}

function* PageChange(action) {
  try {
    yield put({
      type: FORM_CURRENT_PAGE_CHANGE,
      data: action.data,
    });
    yield put({
      type: FORM_LIST_REQUEST,
      data: action.data,
    });
    yield put({
      type: FORM_CURRENT_PAGE_SUCCESS,
    });
  } catch {
    yield put({
      type: FORM_CURRENT_PAGE_ERROR,
    });
  }
}

function* watchPageChange() {
  yield takeLatest(FORM_CURRENT_PAGE_REQUEST, PageChange);
}

export default function* adminSaga() {
  yield all([
    fork(watchLoadForm),
    fork(watchLoadURL),
    fork(watchAdminLogin),
    fork(watchPageChange),
  ]);
}
