import { all, fork, put, takeLatest, call } from 'redux-saga/effects';
import {
  loginAPI,
  getUserDataAPI,
  addAddressAPI,
  updateUserDataAPI,
} from '../apis/user';

import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  USER_FAILURE,
  USER_SUCCESS,
  USER_REQUEST,
  UPDATE_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  ADD_ADDRESS_REQUEST,
  ADD_ADDRESS_SUCCESS,
  ADD_ADDRESS_FAILURE,
} from '../modules/user';

// Redux 액션을 처리하는 사가

// 로그인
function* loadLogin(action) {
  try {
    const token = action.data;
    const result = yield call(loginAPI, token);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
    });
  }
}

function* watchLoadLogin() {
  yield takeLatest(LOG_IN_REQUEST, loadLogin);
}

// 로그아웃
function* loadLogout() {
  try {
    // redux 삭제하기
    // yield put({ type: LOG_OUT_SUCCESS, data: result });
    yield put({ type: LOG_OUT_SUCCESS });
  } catch (err) {
    yield put({ type: LOG_OUT_FAILURE });
  }
}

function* watchLoadLogout() {
  yield takeLatest(LOG_OUT_REQUEST, loadLogout);
}

// 회원 정보 가져오기
function* loadUser(action) {
  try {
    const userId = action.data;
    const result = yield call(getUserDataAPI, userId);
    yield put({
      type: USER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: USER_FAILURE,
    });
  }
}

function* watchLoadUser() {
  yield takeLatest(USER_REQUEST, loadUser);
}

// 주소 추가하기
function* loadAddAddress(action) {
  try {
    const address = action.data;
    const result = yield call(addAddressAPI, address);
    yield put({
      type: ADD_ADDRESS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: ADD_ADDRESS_FAILURE,
    });
  }
}

function* watchLoadAddAddress() {
  yield takeLatest(ADD_ADDRESS_REQUEST, loadAddAddress);
}

// 회원 정보 수정하기
function* loadUpdateUser(action) {
  try {
    const user = action.data;
    const result = yield call(updateUserDataAPI, user);
    yield put({
      type: UPDATE_USER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UPDATE_USER_FAILURE,
    });
  }
}

function* watchUpdateUser() {
  yield takeLatest(UPDATE_USER_REQUEST, loadUpdateUser);
}

export default function* userSaga() {
  yield all([
    fork(watchLoadLogin),
    fork(watchLoadLogout),
    fork(watchLoadUser),
    fork(watchLoadAddAddress),
    fork(watchUpdateUser),
  ]);
}
