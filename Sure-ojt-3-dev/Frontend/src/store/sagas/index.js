import { all, fork } from 'redux-saga/effects';
import user from './user';
import admin from './admin';

export default function* rootSaga() {
  yield all([fork(user), fork(admin)]);
}
