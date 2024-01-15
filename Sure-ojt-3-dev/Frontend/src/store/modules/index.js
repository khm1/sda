import { combineReducers } from 'redux';
import admin from './admin';
import user from './user';

// reducer 통합
export default combineReducers({
  admin,
  user,
});
